import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary'; // ✅ correct
import cors from 'cors'
// routes
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import productRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'
import reviewRoutes from './routes/review.routes.js';
import orderRoutes from './routes/order.routes.js';
import addressRoutes from './routes/address.routes.js';

dotenv.config()
const port = process.env.PORT
const mongo_url = process.env.MONGO_URL
const mongo_name = process.env.DB_NAME

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});
// for mongo db

const connectDB = async () => {

    try {
        await mongoose.connect(mongo_url, {
            dbName: mongo_name,
        });
        console.log("MongoDB connected");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

const app = express()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/review", reviewRoutes)
app.use("/api/order", orderRoutes)
app.use("/api", addressRoutes)

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "frontend", "dist");
    app.use(express.static(frontendPath));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(frontendPath, "index.html"));
    });
}

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
    connectDB()
})
