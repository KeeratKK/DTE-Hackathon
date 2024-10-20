import axios from "axios"; // Import axios for HTTP requests
import { Patient } from "../models/patientModel.js";
import { retrieverPromise } from "../utils/chain.js";
import PdfParse from "pdf-parse/lib/pdf-parse.js";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { formatDocumentsAsString } from "langchain/util/document";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

import streamToBuffer from "stream-to-buffer";

const s3 = new S3Client({
    region: process.env.S3_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
});

const createPatient = async (req, res) => {
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

        const retriever = await retrieverPromise;

        const model = new ChatOpenAI({ model: 'gpt-4' });
        
        const prompt = PromptTemplate.fromTemplate(`You are an expert in FHIR (Fast Healthcare Interoperability Resources) who knows
            a lot about FHIR resource types and resource objects. Answer the user's question based on the following context and user's
            medical history:

            \n-----\n
            Context: {context}
            \n-----\n
            Medical History: {history}
            \n-----\n
            Question: {question}`);


        const chain = RunnableSequence.from([
            {
                context: retriever.pipe(formatDocumentsAsString),
                history: new RunnablePassthrough(),
                question: new RunnablePassthrough(),
            },
            prompt,
            model,
            new StringOutputParser(),
        ]);

        const question = "Given the medical data above, generate FHIR resource json objects for the following FHIR resource types: Patient, Condition, Observation, MedicationRequest, Procedure, and DocumentReference. Separate each json object by exactly one new line character.";

        const answer = await chain.invoke({question: question, history: pdfText});

        console.log(answer);

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

        // // Create the MongoDB patient document
        // const newPatient = await Patient.create({
        //     user_id,
        //     name,
        //     age,
        //     gender,
        //     fhirReference: fhirResponse.data, // Store FHIR resource details (e.g., ID)
        //     medicalFiles: [req.file.location] // Assuming req.file contains file info
        // });

        // // Send the newly created patient as a response
        // res.status(200).json(newPatient);

    } catch (err) {
        console.error("Error with the FHIR request:", err.response ? err.response.data : err.message); // Log more details
        res.status(400).json({ error: err.response ? err.response.data : err.message });
    }
};

export default createPatient;
