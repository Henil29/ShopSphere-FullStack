import { Product } from '../models/product.model.js'
import { Review } from '../models/review.model.js'
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

    const { name, oldprice, newprice, details, category, quantity,timeToDeliver } = req.body;

    const file = req.file;
    const fileUrl = getDataUrl(file);
    if (!fileUrl) {
        return res.status(400).json({
            message: "Please upload an image file"
        });
    }
    if (!name || !newprice || !details || !category || !quantity ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    let product = await Product.findOne({ name })

    if (product) {
        return res.status(400).json({
            message: "Product already exists"
        });
    }

    if(timeToDeliver){
        if (typeof timeToDeliver !== 'string') {
            return res.status(400).json({
                message: "timeToDeliver must be a string"
            });
        }
        if (timeToDeliver.length < 3) {
            return res.status(400).json({
                message: "timeToDeliver must be at least 3 characters long"
            });
        }
        if (timeToDeliver.length > 20) {
            return res.status(400).json({
                message: "timeToDeliver must be at most 20 characters long"
            });
        }
    }
    const myClode = await cloudinary.v2.uploader.upload(fileUrl.content, {
        folder: 'amazon/products',
    })

    product = await Product.create({
        sellerId,
        name,
        oldprice,
        newprice,
        details,
        quantity,
        category,
        timeToDeliver: timeToDeliver || "1 week",
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
    const token = req.cookies.token;
    const sellerId = jwt.verify(token, process.env.JWT_SECRET).id;
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }
    if (product.sellerId.toString() !== sellerId) {
        return res.status(403).json({
            message: "You are not authorized to delete this product"
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
    const { name, newprice, oldprice, details, quantity, category, timeToDeliver } = req.body;
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
    if (name) product.name = name;
    if (newprice) product.newprice = newprice;
    if (oldprice) product.oldprice = oldprice;
    if (details) product.details = details;
    if (quantity) product.quantity = quantity;
    if (category) product.category = category;
    if (timeToDeliver) product.timeToDeliver = timeToDeliver;
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
    
    // Get reviews for this product to calculate rating
    const reviews = await Review.find({ productId: id });
    
    const ratingCount = reviews.length;
    const averageRating = ratingCount > 0 
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / ratingCount).toFixed(1)
        : 0;
    
    const productWithRating = {
        ...product.toObject(),
        rating: parseFloat(averageRating),
        ratingCount
    };
    
    res.status(200).json({
        product: productWithRating
    })
})
export const GetAllProducts = tryCatch(async (req, res) => {
    const products = await Product.find().populate('sellerId','name email');
    
    // Get all reviews to calculate ratings
    const reviews = await Review.find();
    
    // Calculate rating for each product
    const productsWithRatings = products.map(product => {
        const productReviews = reviews.filter(review => 
            review.productId.toString() === product._id.toString()
        );
        
        const ratingCount = productReviews.length;
        const averageRating = ratingCount > 0 
            ? (productReviews.reduce((sum, review) => sum + review.rating, 0) / ratingCount).toFixed(1)
            : 0;
        
        return {
            ...product.toObject(),
            rating: parseFloat(averageRating),
            ratingCount
        };
    });
    
    res.status(200).json({
        message: "Products fetched",
        products: productsWithRatings
    })
})