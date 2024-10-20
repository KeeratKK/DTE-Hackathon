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
        required: false,
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
    pendingDoctors: [
        {
            type: Schema.Types.ObjectId,
        }
    ],
    acceptedDoctors: [
        {
            type: Schema.Types.ObjectId,
        }
    ]
});

export const Patient = mongoose.model('Patient', patientSchema, 'Patient');