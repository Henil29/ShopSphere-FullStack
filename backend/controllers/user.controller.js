import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import tryCatch from '../utils/tryCatch.js';
import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';

export const Userinfo = tryCatch(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json({
        message: "User found",
        user
    });
})
export const Updateinfo = tryCatch(async (req, res) => {
    const { name, email, oldPassword, newPassword, isSeller } = req.body

    const token = req.cookies.token;
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (typeof isSeller !== 'boolean') {
        return res.status(400).json({ message: "isSeller must be a boolean" });
    }
    else { user.isSeller = isSeller; }

    if ((newPassword && !oldPassword) || (oldPassword && !newPassword)) {
        return res.status(400).json({ message: "Please enter both old and new password" })
    }
    if (newPassword && oldPassword) {
        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) {
            return res.status(400).json({ message: "Old Password is incorrect" });
        }
        user.password = await bcrypt.hash(newPassword, 10);
    }
    await user.save();
    res.json({ message: "User updated successfully" });
})
export const Deleteinfo = tryCatch(async (req, res) => {
    const token = req.cookies.token;
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if(user.isSeller){
        const products = await Product.find({ sellerId: userId });

        for (const product of products) {
            await Product.findByIdAndDelete(product._id);
        }

    }
    await user.deleteOne();
    await Cart.deleteOne({ userId });
    res.json({ message: "User deleted successfully" });
})