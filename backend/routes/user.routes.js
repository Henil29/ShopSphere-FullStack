import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { Deleteinfo, Updateinfo, Userinfo } from '../controllers/user.controller.js';

const router = express.Router();

router.get("/me",isAuth,Userinfo)
router.put("/update",isAuth,Updateinfo)
router.delete("/delete",isAuth,Deleteinfo)

export default router;