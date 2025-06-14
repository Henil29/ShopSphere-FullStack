import mongoose, { model } from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 }
},{ timestamps: true });

export const  Review= model('Review', reviewSchema);
