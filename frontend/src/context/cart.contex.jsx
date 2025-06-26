import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchCart() {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/cart/");
      setCarts(data.cart);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch carts:", error);
      setLoading(false);
    }
  }
  async function addToCart(productId) {
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/cart/${productId}`);
      setCarts(data.cart);
      setLoading(false);
    }
    catch (error) {
      console.error("Failed to add product to cart:", error);
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ carts, loading, fetchCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const CartData = () => useContext(CartContext);