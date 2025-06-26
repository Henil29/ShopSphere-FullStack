import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const [products, setCarts] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchCart() {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/cart/");
      setCarts(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setLoading(false);
    }
  }
  async function addToCart(productId) {
    setLoading(true);
    try{
      const { data } = await axios.post(`/api/cart/${productId}`);
      console.log("API response data:", data);
      // setCarts([...products, data]);
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
    <CartContext.Provider value={{ products, loading, fetchCart,addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const CartData = () => useContext(CartContext);