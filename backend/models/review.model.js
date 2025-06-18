import mongoose, { model } from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    message: { type: String},
    rating: { type: Number, min: 1, max: 5 , required: true }
},{ timestamps: true });

export const  Review= model('Review', reviewSchema)