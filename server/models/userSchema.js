import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    role: String,
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
