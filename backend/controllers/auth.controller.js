import { User } from '../models/user.model.js'
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";
import tryCatch from '../utils/tryCatch.js';
import { Cart } from '../models/cart.model.js';

export const register = tryCatch(async (req, res) => {
    const { name, email, password, isSeller } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }
    let user = await User.findOne({ email })
    if (user) {
        return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
        name,
        email,
        password: hashedPassword,
        isSeller
    })
    // Create an empty cart for the new user
    await Cart.create({ userId: user._id, items: [] });
    const token = generateToken(user._id, res);

    res.status(201).json({
        message: "User registered successfully",
        user,
        isSeller
    })

})

export const login = tryCatch(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Please fill in all fields" })
    }
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" })
    }
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid email or password" })
    }
    const token = generateToken(user._id, res)
    res.status(200).json({
        message: "User logged in successfully",
        token,user,
        isSeller: user.isSeller
    })
})

export const logout = tryCatch(async (req, res) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(200).json({ message: "You are not loging" });
    }

    res.clearCookie('token')
    res.status(200).json({ message: "User logged out successfully" })
})