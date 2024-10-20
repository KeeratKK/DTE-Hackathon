import mongoose from 'mongoose';
import UserModel from '../models/userSchema.js';
import { Patient } from '../models/patientModel.js';
import OpenAI from 'openai'; 

export const getFhirReferenceByUserId = async (req, res) => {
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const fhirReference = await Patient.findOne({ user_id: user._id }).select('fhirReference');
        if (!fhirReference) {
            return res.status(404).json({ message: 'FHIR reference not found' });
        }

        const eventData = await createEvent(JSON.stringify(fhirReference));
        if (eventData.error) {
            return res.status(500).json({ message: eventData.error });
        }

        res.status(200).json(eventData);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const createEvent = async (text) => {
    try {
        const prompt = `
            Extract required information from the given query and this is an fhir resourse object. I want you to display the information in this to human readable form. Format it in the defined JSON format.

            Final JSON Format:
            {
                "Patient Summary": 
                "Condition Summary": 
                "MedicationRequest Summary": 
                "Procedure Summary": 
                "Observation Summary": 
                "DocumentReference Summary": 
            }

            Query: ${text}

            There should be a total of six objects: Patient, Condition, Observation, MedicationRequest, Procedure, DocumentReference.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const aiResponse = response.choices[0].message.content;

        let parsedData;
        try {
            parsedData = JSON.parse(aiResponse);
        } catch (error) {
            console.error("Error parsing JSON from AI response:", error);
            return { error: 'Failed to parse JSON from AI response.' };
        }

        return parsedData;

    } catch (error) {
        console.error(error);
        return { error: 'Something went wrong' };
    }
};
