import mongoose from 'mongoose';
import UserModel from '../models/userSchema.js';
import { Patient } from '../models/patientModel.js';
import OpenAI from 'openai'; 
import { Doctor } from '../models/doctorModel.js';
import User from '../models/userSchema.js'

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


export const updateDoctor = async (req, res) => {
    const { patientId, doctorId, decision } = req.body;

    if (!patientId || !doctorId || !decision) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const patient = await Patient.findOne({ user_id: patientId });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        if (decision.toLowerCase() === 'no') {
            patient.pendingDoctors = patient.pendingDoctors.filter(
                (id) => !id.equals(doctorId)
            );
            await patient.save();
            return res.status(200).json({ message: 'Doctor removed from pending list' });
        }

        if (decision.toLowerCase() === 'yes') {
            patient.pendingDoctors = patient.pendingDoctors.filter(
                (id) => !id.equals(doctorId)
            );

            if (!patient.acceptedDoctors.includes(doctorId)) {
                patient.acceptedDoctors.push(doctorId);
            }

            await patient.save();

            const doctor = await Doctor.findOne({ user_id: doctorId });
            if (doctor) {
                if (!doctor.patients.includes(patientId)) {
                    doctor.patients.push(patientId);
                    await doctor.save();
                }
            }

            return res.status(200).json({ message: 'Doctor accepted and updated successfully' });
        }

        return res.status(400).json({ message: 'Invalid decision value' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while updating doctor status' });
    }
};


export const requestPatientData = async (req, res) => {
    const { email, doctorId } = req.body;

    if (!email || !doctorId) {
        return res.status(400).json({ message: 'Email and doctor ID are required' });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No user found with this email' });
        }

        const patient = await Patient.findOne({ user_id: user._id });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found for this user' });
        }

        if (patient.pendingDoctors.includes(doctorId) || patient.acceptedDoctors.includes(doctorId)) {
            return res.status(400).json({ message: 'Doctor already has a pending or accepted request for this patient' });
        }
    

        patient.pendingDoctors.push(new mongoose.Types.ObjectId(doctorId));
        await patient.save();

        return res.status(200).json({ message: 'Doctor request sent successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while processing the request' });
    }
};


export const getDoctorPatients = async (req, res) => {
    try {
        const { doctorId } = req.query;
        console.log(req.params);

        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            return res.status(400).json({ message: 'Invalid doctor ID' });
        }

        const doctor = await Doctor.findOne({ user_id: doctorId });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const patients = await Patient.find({ user_id: { $in: doctor.patients } });

        return res.status(200).json(patients);
    } catch (error) {
        console.error("Error fetching doctor's patients:", error);
        return res.status(500).json({ message: 'An error occurred while fetching patients' });
    }
};


export const getDoctorsByPatientId = async (req, res) => {
    const { patientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
        return res.status(400).json({ message: 'Invalid patient ID' });
    }

    try {
        console.log("Fetching patient with ID:", patientId); 
        const patient = await Patient.findOne({ user_id: patientId });
    
        if (!patient) {
            console.log("Patient not found"); 
            return res.status(404).json({ message: 'Patient not found' });
        }
    
        // Fetch doctors from both accepted and pending lists
        const acceptedDoctorIds = patient.acceptedDoctors || [];
        const pendingDoctorIds = patient.pendingDoctors || [];
        const allDoctorIds = [...acceptedDoctorIds, ...pendingDoctorIds];

        console.log("Doctor IDs found:", allDoctorIds); 
    
        if (allDoctorIds.length === 0) {
            console.log("No doctors associated with this patient"); 
            return res.status(200).json({ doctors: [] });
        }

        // Fetch the doctor details from User collection
        let doctors = await User.find({ _id: { $in: allDoctorIds } });

        console.log("Doctors fetched:", doctors); 
    
        if (!doctors || doctors.length === 0) {
            return res.status(200).json({ doctors: [] });
        }

        // Map and format the doctor data with an additional flag (pending/accepted)
        const formattedDoctors = doctors.map(doctor => {
            const isAccepted = acceptedDoctorIds.includes(doctor._id.toString());
            const isPending = pendingDoctorIds.includes(doctor._id.toString());

            return {
                user_id: doctor.user_id,
                first_name: doctor.first_name,
                last_name: doctor.last_name,
                email: doctor.email,
                user_id: doctor.id,
                status: isAccepted ? 'accepted' : isPending ? 'pending' : 'unknown'
            };
        });
    
        res.status(200).json({ doctors: formattedDoctors });
    } catch (error) {
        console.error('Error fetching doctors:', error.message);  // Log the actual error
        res.status(500).json({ message: `An error occurred while fetching doctors: ${error.message}` });
    }
};
