import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';
import tryCatch from '../utils/tryCatch.js';
import jwt from 'jsonwebtoken';

export const AddtoCart = tryCatch(async (req, res) => {
    const { id } = req.params;
    const { quantity = 1 } = req.body || {};
    const product = await Product.findById(id)

    const token = req.cookies.token;
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = await Cart.create({ userId });
    }

    const productInCart = await cart.items.find((p) =>
        p.productId.toString() === id.toString()
    );

    if (productInCart) {
        productInCart.quantity += Number(quantity);
    } else {
        cart.items.push({ productId: id, quantity: Number(quantity) });
    }

    await cart.save();
    res.json({ cart });
})
export const ChangeQuantity = tryCatch(async (req, res) => {
    const { id } = req.params;
    let { quantity } = req.body || {};
    const token = req.cookies.token;
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }
    const productInCart = await cart.items.find((p) =>
        p.productId.toString() === id.toString()
    );
    if (!productInCart) {
        return res.status(404).json({ message: "Product not found in cart" });
    }
    if (quantity < 1) {
        quantity = 1
    }
    productInCart.quantity = Number(quantity);
    await cart.save();
    res.json({ cart });
})
export const RemoveProduct = tryCatch(async (req, res) => {
    const { id } = req.params;
    const token = req.cookies.token;
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;
  
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
  
    const itemToRemove = cart.items.find(
      (p) => p._id.toString() === id.toString()
    );
  
    if (!itemToRemove) {
      return res.status(404).json({ message: "Cart item not found" });
    }
  
    cart.items.pull(itemToRemove._id);
    await cart.save();
  
    res.json({ cart });
  });
  

export const GetCart = tryCatch(async (req, res) => {
    const token = req.cookies.token;
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({
        cart
    })
})