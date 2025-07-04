import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { addAddress, deleteAddress, Deleteinfo, editAddress, getAllAddresses, Updateinfo, Userinfo } from '../controllers/user.controller.js';

const router = express.Router();

router.get("/me",isAuth,Userinfo)
router.put("/update",isAuth,Updateinfo)
router.delete("/delete",isAuth,Deleteinfo)
router.post("/address", isAuth,addAddress)
router.get("/address/all", isAuth,getAllAddresses)
router.put("/address/:id", isAuth, editAddress);
router.delete("/address/:id", isAuth,deleteAddress)

export default router;