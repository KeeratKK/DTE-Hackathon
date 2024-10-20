import mongoose from "mongoose";

const Schema = mongoose.Schema;

const doctorSchema = Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        unique: false,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    patients: [
        {
            type: Schema.Types.ObjectId,
        }
    ]
});

export const Doctor = mongoose.model('Doctor', doctorSchema, 'Doctor');