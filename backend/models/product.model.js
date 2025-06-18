import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  oldprice: { type: Number},
  newprice: { type: Number, required: true },
  details: { type: String },
  quantity: { type: Number, required: true },
  category: { type: [String], required: true },
  image: {
    id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }

}, { timestamps: true })

export const Product = mongoose.model('Product', productSchema)