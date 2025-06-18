import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { addReview, deleteReview, getReviews, updateReview } from '../controllers/review.controller.js';

const router = express.Router();

router.get("/all",getReviews)
router.post("/:id", isAuth, addReview);
router.delete("/:id",isAuth,deleteReview)
router.put("/:id",isAuth,updateReview)
// router.get("/:id",GetProduct)

export default router;
