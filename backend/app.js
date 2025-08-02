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
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
      });
      console.log("✅ MongoDB connected");
    } catch (error) {
      console.error("❌ MongoDB connection error:", error.message);
    }
  };
  
connectDB()

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

export default app