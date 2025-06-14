import mongoose, { model } from "mongoose";

const UserShema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isSeller: { type: Boolean, default: false }
}, { timestamps: true });

export const User = model('User', UserShema);