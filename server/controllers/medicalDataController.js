import axios from "axios"; // Import axios for HTTP requests
import { Patient } from "../models/patientModel.js";
import { retrieverPromise } from "../utils/chain.js";
import PdfParse from "pdf-parse/lib/pdf-parse.js";
import { RunnablePassthrough, RunnableSequence, RunnableLambda } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { formatDocumentsAsString } from "langchain/util/document";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import jsonlint from "jsonlint";
import { Document } from "langchain/document";

import streamToBuffer from "stream-to-buffer";

const s3 = new S3Client({
    region: process.env.S3_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
});

const fixJson = (jsonStr) => {

    return jsonStr
        .replace(/([{,])([^"{}\[\],\s]+)/g, '$1"$2"') // Add quotes around keys
        .replace(/([:])([^"{}\[\],\s]+)/g, '$1"$2"') // Add quotes around values
        .replace(/(\s*:\s*"(.*?)\s*")/, ': "$2"') // Clean up whitespace in quotes
        .replace(/([,]\s*?)(?=\{)/g, '') // Remove trailing commas
        .replace(/([}|\]])(?=\s*[{])/g, '$1,') // Add commas after } or ] if followed by {
        .replace(/(\])(?=\s*})/g, '$1,'); // Add comma after ] if followed by }
}

export const createPatient = async (req, res) => {
    try {
        const { user_id, name, age, gender } = req.body;

        const lastName = name.split(' ')[1] || ''; // Split by space
        const firstName = name.split(' ')[0];

        let pdfText = "";

        try {

            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: req.file.key,
            };

            const data = await s3.send(new GetObjectCommand(params));

            const buffer = await new Promise((resolve, reject) => {
                streamToBuffer(data.Body, (err, buffer) => {
                    if(err) {
                        return reject(err);
                    }
                    resolve(buffer);
                })
            });

            const result = await PdfParse(buffer);
            pdfText += result.text.replace(/\n/g, '');


            // streamToBuffer(data.Body, async (err, buffer) => {

            //     if(err) {
            //         console.log("Error Converting Stream to Buffer", err);
            //     }

            //     const result = await PdfParse(buffer);
            //     const cleaned = result.text.replace(/\n/g, '');
            //     pdfText += cleaned;

            // });

        } catch (error) {

            console.error("Error while parsing PDF:", error);
            res.status(500).send('Error processing PDF');

        }

        console.log(typeof(pdfText));

        const formatDocs = (docs) => docs.map((doc) => doc.pageContent);

        const retriever = await retrieverPromise;

        const model = new ChatOpenAI({});
        
        const prompt = PromptTemplate.fromTemplate(`You are an expert in FHIR (Fast Healthcare Interoperability Resources) with extensive knowledge of FHIR resource types and resource objects. Your task is to answer the user's question based solely on the user's medical history provided below. 

            If any information requested in the question is not present in the medical history, do not make assumptions or provide speculative information. 

            Please prioritize accuracy in your response and ensure the json is formatted properly with commas so that another agent can easily parse the information. Do not surround each json object with the words json. Append an empty json object at the end of the response and Ensure there is no character after the last json object.

            \n-----\n
            Medical History: {history}
            \n-----\n
            Question: {question}`);

        // const prompt = PromptTemplate.fromTemplate(`You are an expert in FHIR (Fast Healthcare Interoperability Resources) with extensive knowledge
        //     of FHIR resource types and resource objects. Here is some relevant FHIR documentation:
            
        //     Context: {context}
            
        //     Your task is to answer the user's question based solely on the medical history provided below. The context is only a referenceto help
        //     understand the FHIR resource type. Do not use the context to create or infer any data for the FHIR resource objects. All FHIR resource
        //     objects should be generated exclusively from the medical history provided below.
            
        //     If any information requested in the question is not present in the medical history, do not make assumptions or provide speculative information.
            
        //     Please ensure the JSON is formatted correctly with commas so that another agent can easily parse the information. Do not surround each
        //     JSON object with the word "json". Append an empty JSON object at the end of the response, and ensure there is no character after the last 
        //     JSON object.
            
        //     Medical History: {history}
        //     \n-----\n
        //     Question: {question}`);
        
        const question = "Given the medical data above, generate FHIR resource json objects for the following FHIR resource types: Patient, Condition, Observation, MedicationRequest, Procedure, and DocumentReference. Separate each json object by exactly one new line character.";


        // const retDocs = await retriever._getRelevantDocuments(question);
        // console.log(retDocs);
        const chain = RunnableSequence.from([
            {
                question: new RunnablePassthrough(),
                history: new RunnablePassthrough(),
            },
            prompt,
            model,
            new StringOutputParser(),
        ]);
        
        // const chain = RunnableSequence.from([
        //     RunnableLambda.from((input) => input.question), // Extracts the question from input
        //     {
        //         context: retriever.pipe(formatDocumentsAsString), // Assuming formatDocs is set up to return a string
        //         question: new RunnablePassthrough(), // Passes the question directly
        //         history: new RunnablePassthrough(), // Adds history as a passthrough runnable
        //     },
        //     prompt,
        //     model, // Your language model instance
        //     new StringOutputParser(),
        // ]);

        const answer = await chain.invoke({question: question, history: pdfText});

        console.log(answer);

        const jsonObjects = answer
            .trim() // Remove leading/trailing whitespace
            .split(/}\s*(?=\{)/g) // Split by closing brace followed by an opening brace
            .map(json => json.trim() + '}') // Ensure each piece ends with a closing brace
            .filter(obj => obj); // Filter out any empty strings

        // Parse each matched JSON string into a JSON object
        let counter = 1;
        const parsedObjects = jsonObjects.map(jsonStr => {

            if(counter === 7) return null;

            try {
                counter++;
                return JSON.parse(jsonStr);
            } catch (error) {
                console.error("Failed to parse JSON:", jsonStr, error);
                return null; // Return null for failed parses
            }
        }).filter(obj => obj !== null); // Filter out any null entries

        console.log(parsedObjects);

        console.log('https://hapi.fhir.org/baseR4/' + parsedObjects[1]['resourceType']);

        const fhirReferences = [];

        const endings = ['https://hapi.fhir.org/baseR4/Patient', 'https://hapi.fhir.org/baseR4/Condition', 'https://hapi.fhir.org/baseR4/Observation', 
            'https://hapi.fhir.org/baseR4/MedicationRequest', 'https://hapi.fhir.org/baseR4/Procedure', 'https://hapi.fhir.org/baseR4/DocumentReference'];

        const patientResponse = await axios.post(endings[0], parsedObjects[0]);
        const patientId = patientResponse.data.id;

        for(let i = 1; i < 6; i++) {
            parsedObjects[i]['subject']['reference'] = `Patient/${patientId}`;
        }

        fhirReferences.push(patientResponse);

        for(let i = 1; i < 6; i++) {
            const fhirResponse = await axios.post(endings[i], parsedObjects[i]);
            fhirReferences.push(fhirResponse);
        }

        // res.status(200).json(answer);

        // // Create the FHIR Patient resource
        // const fhirPatient = {
        //     resourceType: 'Patient', 
        //     name: [
        //         {
        //             family: lastName,
        //             given: [firstName],
        //         },
        //     ],
        //     gender: gender,
        //     birthDate: age ? new Date().getFullYear() - age + '-01-01' : undefined, // Fix field to be birthDate
        // };

        // // Send a POST request to create the patient in the FHIR server
        // const fhirResponse = await axios.post('https://hapi.fhir.org/baseR4/Patient', fhirPatient);

        const tempFhir = fhirReferences.map(ref => ref.data);

        // // Create the MongoDB patient document
        const newPatient = await Patient.create({
            user_id,
            name,
            age,
            gender,
            fhirReference: tempFhir, // Store FHIR resource details (e.g., ID)
            medicalFiles: [req.file.location] // Assuming req.file contains file info
        });

        // for(let i = 1; i < 6; i++) {
        //     await Patient.create({
        //         user_id,
        //         name,
        //         fhirReference: fhirReferences[i].data,
        //         medicalFiles: [req.file.location]
        //     });
        //     console.log(`${i}hi`);
        // }

        // // Send the newly created patient as a response
        res.status(200).json(newPatient);

    } catch (err) {
        console.error("Error with the FHIR request:", err.response ? err.response.data : err.message); // Log more details
        res.status(400).json({ error: err.response ? err.response.data : err.message });
    }
};

export const getPdfUrls = async (req, res) => {

    try {

        const { user_id } = req.body;

        const patient = await Patient.findOne({ user_id });

        if(!patient) {
            return res.status(400).json({ message: "User not Found"});
        }

        res.status(200).json(patient.medicalFiles);

    } catch (err) {
        console.log("Error with getting URLS:", err);
        res.status(500).json({ message: "Server error" });
    }

}
