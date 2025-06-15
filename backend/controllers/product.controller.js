import { Product } from '../models/product.model.js'
import tryCatch from '../utils/tryCatch.js';
import jwt from 'jsonwebtoken';
import getDataUrl from '../utils/uriGenerator.js';
import cloudinary from "cloudinary";

export const AddProduct = tryCatch(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "Please upload an image file"
        });
    }

    const token = req.cookies.token;
    const sellerId = jwt.verify(token, process.env.JWT_SECRET).id;

    const { name, price, details, category, quantity } = req.body;

    const file = req.file;
    const fileUrl = getDataUrl(file);
    if (!fileUrl) {
        return res.status(400).json({
            message: "Please upload an image file"
        });
    }
    if (!name || !price || !details || !category || !quantity) {
        return res.status(400).json({
            message: "All fields are required",
            name, price, details, description, category, quantity
        });
    }


    let product = await Product.findOne({ name })

    if (product) {
        return res.status(400).json({
            message: "Product already exists"
        });
    }
    const myClode = await cloudinary.v2.uploader.upload(fileUrl.content, {
        folder: 'amazon/products',
    })

    product = await Product.create({
        sellerId,
        name,
        price,
        details,
        quantity,
        category,
        image: {
            id: myClode.public_id,
            url: myClode.secure_url
        }
    })

    res.status(201).json({
        message: "Product created successfully",
        product,
    })

})

export const DeleteProduct = tryCatch(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }
    await cloudinary.v2.uploader.destroy(product.image.id);
    await product.deleteOne();
    res.status(200).json({
        message: "Product deleted successfully"
    })
})

export const UpdateProduct = tryCatch(async (req, res) => {
    const { id } = req.params;
    const { name, price, details, quantity, category } = req.body;
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }
    const file = req.file;
    if (file) {
        const fileurl = getDataUrl(file);

        await cloudinary.v2.uploader.destroy(product.image.id)
        const myCloud = await cloudinary.v2.uploader.upload(fileurl.content, {
            folder: 'amazon/products',
        });
        product.image.id = myCloud.public_id;
        product.image.url = myCloud.secure_url;
    }
    if (name) product.name = name
    if (price) product.price = price
    if (details) product.details = details
    if (quantity) product.quantity = quantity
    if (category) product.category = category
    await product.save();
    res.status(200).json({
        message: "Product updated successfully",
        product
    })

})

export const GetProduct = tryCatch(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }
    res.status(200).json({
        product
    })
})
export const GetAllProducts = tryCatch(async (req, res) => {
    const products = await Product.find().populate('sellerId','name email');
    res.status(200).json({
        message: "Products fetched",
        products
    })
})