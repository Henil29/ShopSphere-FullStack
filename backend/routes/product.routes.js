import express from 'express';
import { isAuth, isSeller } from '../middlewares/isAuth.js';
import uploadFile from '../middlewares/multrer.js';
import { AddProduct, DeleteProduct, GetAllProducts, GetProduct, UpdateProduct } from '../controllers/product.controller.js';

const router = express.Router();

router.get("/all",GetAllProducts)
router.get("/:id",GetProduct)
router.post("/add", isAuth,isSeller, uploadFile, AddProduct);
router.delete("/:id",isAuth,isSeller,DeleteProduct)
router.put("/:id",isAuth,isSeller,uploadFile,UpdateProduct)

export default router;
