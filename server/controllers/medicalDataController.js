import axios from "axios"; // Import axios for HTTP requests
import { Patient } from "../models/patientModel.js";

const createPatient = async (req, res) => {
    try {
        const { user_id, name, age, gender } = req.body;

        const lastName = name.split(' ')[1] || ''; // Split by space
        const firstName = name.split(' ')[0];

        // Create the FHIR Patient resource
        const fhirPatient = {
            resourceType: 'Patient', // resourceType should be a string
            name: [
                {
                    family: lastName,
                    given: [firstName],
                },
            ],
            gender: gender,
            birthDate: age ? new Date().getFullYear() - age + '-01-01' : undefined, // Fix field to be birthDate
        };

        // Send a POST request to create the patient in the FHIR server
        const fhirResponse = await axios.post('https://hapi.fhir.org/baseR4/Patient', fhirPatient);

        // Create the MongoDB patient document
        const newPatient = await Patient.create({
            user_id,
            name,
            age,
            gender,
            fhirReference: fhirResponse.data, // Store FHIR resource details (e.g., ID)
            medicalFiles: [req.file.location] // Assuming req.file contains file info
        });

        // Send the newly created patient as a response
        res.status(200).json(newPatient);

    } catch (err) {
        console.error("Error with the FHIR request:", err.response ? err.response.data : err.message); // Log more details
        res.status(400).json({ error: err.response ? err.response.data : err.message });
    }
};

export default createPatient;
