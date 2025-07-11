import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true, select: false },
    phoneNumber: { type: String },
    email: { type: String },
});

const UserModel = model("user", userSchema, "users");

export default UserModel;
