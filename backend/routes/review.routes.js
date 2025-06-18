import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { addReview, deleteReview, getReviews } from '../controllers/review.controller.js';

const router = express.Router();

router.get("/all",getReviews)
router.post("/:id", isAuth, addReview);
router.delete("/:id",isAuth,deleteReview)
// router.get("/:id",GetProduct)
// router.put("/:id",isAuth,isSeller,uploadFile,UpdateProduct)

export default router;
