import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { createOrder, deleteOrder, getAllOrders, getCurrentOrder, getOrderById, updateOrderStatus } from '../controllers/order.controller.js';

const router = express.Router();

router.get("/",isAuth,getCurrentOrder)
router.post("/", isAuth, createOrder);
router.get("/all", isAuth, getAllOrders);
router.get("/:id", isAuth, getOrderById);
router.delete("/:id",isAuth,deleteOrder)
router.put("/:id/status",isAuth,updateOrderStatus)
export default router;