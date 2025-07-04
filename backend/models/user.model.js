import mongoose, { model } from "mongoose";

const UserShema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: [{
        street: { type: String },
        city: { type: String },
        country: { type: String },
        postalCode: { type: Number, required: true, min: 100000, max: 999999 },
    }],
    isSeller: { type: Boolean, default: false }
}, { timestamps: true });

export const User = model('User', UserShema);