import express from 'express';
import { 
  getUserAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress 
} from '../controllers/address.controller.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

// All routes require authentication
router.use(isAuth);

// Get all addresses for the authenticated user
router.get('/user/addresses', getUserAddresses);

// Add a new address
router.post('/user/addresses', addAddress);

// Update an address
router.put('/user/addresses/:id', updateAddress);

// Delete an address
router.delete('/user/addresses/:id', deleteAddress);

// Set address as default
router.patch('/user/addresses/:id/default', setDefaultAddress);

export default router; 