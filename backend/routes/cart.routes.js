import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { AddtoCart, ChangeQuantity, GetCart, RemoveProduct } from '../controllers/cart.controller.js';

const router = express.Router()

router.get("/:id",isAuth,GetCart)
router.post("/:id",isAuth,AddtoCart)
router.put("/:id",isAuth,ChangeQuantity)
router.delete("/:id",isAuth,RemoveProduct)

export default router;