import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import tryCatch from "../utils/tryCatch.js";
import jwt from 'jsonwebtoken';

export const createOrder = tryCatch(async (req, res) => {
    const { products, paymentMethod, addressNum } = req.body;

    if (!products || !paymentMethod) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }
    const token = req.cookies.token;
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    // take address from user model. but take addressNum number's of address
    if (!addressNum) {
        return res.status(400).json({
            message: "Address number is required"
        });
    }

    const shippingAddress = await User.findById(userId).select('address')[addressNum];
    if (!shippingAddress) {
        return res.status(404).json({
            message: "Address not found"
        });
    }
    let totalAmount = 0;
    for (const item of products) {
        const product = await Product.findById(item.productId);
        if (!product) {
            return res.status(404).json({
                message: `Product with ID ${item.productId} not found`
            });
        }
        totalAmount += product.newprice * item.quantity;
    }

    // remove product quantity from stock

    for (const item of products) {
        const product = await Product.findById(item.productId);
        if (product.stock < item.quantity) {
            return res.status(400).json({
                message: `Insufficient stock for product ${product.name}`
            });
        }
        product.stock -= item.quantity;
        await product.save();
    }
    const order = await Order.create({
        userId: userId,
        products,
        totalAmount,
        paymentMethod,
    });

    res.status(201).json({
        message: "Order created successfully",
        order
    });
});
export const getAllOrders = tryCatch(async (req, res) => {
    const token = req.cookies.token;
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;

    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    const orders = await Order.find({ userId }).populate('products.productId', 'name newprice image');

    res.status(200).json({
        message: "Orders fetched successfully",
        orders
    });
});
export const getOrderById = tryCatch(async (req, res) => {
    const token = req.cookies.token;
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;
    const { id } = req.params;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    const order = await Order.findById(id).populate('products.productId', 'name newprice image');
    if (!order) {
        return res.status(404).json({
            message: "Order not found"
        });
    }
    res.status(200).json({
        message: "Order fetched successfully",
        order
    });
})
export const getCurrentOrder = tryCatch(async (req, res) => {
    const token = req.cookies.token;
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;

    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    const order = await Order.findOne({ userId, status: 'Pending' }).populate('products.productId', 'name newprice image');

    if (!order) {
        return res.status(404).json({
            message: "No current order found"
        });
    }

    res.status(200).json({
        message: "Current order fetched successfully",
        order
    });
});
export const updateOrderStatus = tryCatch(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            message: "Status is required"
        });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
        return res.status(404).json({
            message: "Order not found"
        });
    }

    res.status(200).json({
        message: "Order status updated successfully",
        order
    });
});
export const deleteOrder = tryCatch(async (req, res) => {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
        return res.status(404).json({
            message: "Order not found"
        });
    }
    // Optionally, you can also restore the stock of products in the order
    for (const item of order.products) {
        const product = await Product.findById(item.productId);
        if (product) {
            product.stock += item.quantity;
            await product.save();
        }
    }
    res.status(200).json({
        message: "Order deleted successfully"
    });
});