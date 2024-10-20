import mongoose from "mongoose";

const Schema = mongoose.Schema;

const patientSchema = Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        unique: false,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    age: Number,
    gender: String,
    fhirReference: {
        type: Object,
    },
    medicalFiles: [
        {
            type: String,
        },
    ],
});

export const Patient = mongoose.model('Patient', patientSchema, 'Patient');