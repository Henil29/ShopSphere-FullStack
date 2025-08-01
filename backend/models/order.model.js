import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Shipped','Dispatched', 'Delivered '], default: 'Pending' },
    paymentMethod: { type: String, enum: ['Cash', 'Card', 'Online'],default: 'Cash', required: true },
    shippingAddress: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);