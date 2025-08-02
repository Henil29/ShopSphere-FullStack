import { Address } from '../models/address.model.js';
import tryCatch from '../utils/tryCatch.js';
import jwt from 'jsonwebtoken';

// Get all addresses for a user
export const getUserAddresses = tryCatch(async (req, res) => {
  const token = req.cookies.token;
  const userId = jwt.verify(token, process.env.JWT_SECRET).id;

  const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
  
  res.status(200).json({
    success: true,
    addresses
  });
});

// Add a new address
export const addAddress = tryCatch(async (req, res) => {
  const token = req.cookies.token;
  const userId = jwt.verify(token, process.env.JWT_SECRET).id;

  const { name, phone, street, city, state, pincode, isDefault } = req.body;

  // Validate required fields
  if (!name || !phone || !street || !city || !state || !pincode) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  // If this is set as default, unset other default addresses
  if (isDefault) {
    await Address.updateMany(
      { userId, isDefault: true },
      { isDefault: false }
    );
  }

  const address = await Address.create({
    userId,
    name,
    phone,
    street,
    city,
    state,
    pincode,
    isDefault: isDefault || false
  });

  res.status(201).json({
    success: true,
    message: "Address added successfully",
    address
  });
});

// Update an address
export const updateAddress = tryCatch(async (req, res) => {
  const token = req.cookies.token;
  const userId = jwt.verify(token, process.env.JWT_SECRET).id;
  const { id } = req.params;

  const address = await Address.findOne({ _id: id, userId });
  if (!address) {
    return res.status(404).json({
      success: false,
      message: "Address not found"
    });
  }

  const { name, phone, street, city, state, pincode, isDefault } = req.body;

  // If this is set as default, unset other default addresses
  if (isDefault) {
    await Address.updateMany(
      { userId, isDefault: true, _id: { $ne: id } },
      { isDefault: false }
    );
  }

  // Update address fields
  if (name) address.name = name;
  if (phone) address.phone = phone;
  if (street) address.street = street;
  if (city) address.city = city;
  if (state) address.state = state;
  if (pincode) address.pincode = pincode;
  if (typeof isDefault === 'boolean') address.isDefault = isDefault;

  await address.save();

  res.status(200).json({
    success: true,
    message: "Address updated successfully",
    address
  });
});

// Delete an address
export const deleteAddress = tryCatch(async (req, res) => {
  const token = req.cookies.token;
  const userId = jwt.verify(token, process.env.JWT_SECRET).id;
  const { id } = req.params;

  const address = await Address.findOne({ _id: id, userId });
  if (!address) {
    return res.status(404).json({
      success: false,
      message: "Address not found"
    });
  }

  await Address.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Address deleted successfully"
  });
});

// Set address as default
export const setDefaultAddress = tryCatch(async (req, res) => {
  const token = req.cookies.token;
  const userId = jwt.verify(token, process.env.JWT_SECRET).id;
  const { id } = req.params;

  const address = await Address.findOne({ _id: id, userId });
  if (!address) {
    return res.status(404).json({
      success: false,
      message: "Address not found"
    });
  }

  // Unset all other default addresses
  await Address.updateMany(
    { userId, isDefault: true },
    { isDefault: false }
  );

  // Set this address as default
  address.isDefault = true;
  await address.save();

  res.status(200).json({
    success: true,
    message: "Default address updated successfully",
    address
  });
}); 