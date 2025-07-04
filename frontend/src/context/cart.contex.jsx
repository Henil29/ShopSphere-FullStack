import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const [carts, setCarts] = useState(null);
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
  async function addToCart(productId, quantity = 1) {
    setLoading(true);

    try {
      const { data } = await axios.post(`/api/cart/${productId}`, { quantity });
      setCarts(data.cart);
      await fetchCart();
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      setLoading(false);
      return { success: false };
    }
  }

  async function deleteCartItem(cartItemId) {
    setLoading(true);
    try {
      const { data } = await axios.delete(`/api/cart/${cartItemId}`);
      setCarts(data.cart);
      await fetchCart();
      setLoading(false);
    }
    catch (error) {
      console.error("Failed to delete cart item:", error);
      setLoading(false);
    }
  }

  // async function updateCartItemQuantity(cartItemId, quantity) {
  //   try{
  //     console.log("Updating cart item quantity:", cartItemId, quantity);
  //     const { data } = await axios.put(`/api/cart/`+cartItemId, { quantity });
  //     setCarts(data.cart);
  //     await fetchCart();
  //   }
  //   catch (error) {
  //     console.error("Failed to update cart item quantity:", error);
  //   }
  // }
  useEffect(() => {
    fetchCart();
  }, []);
  async function updateCartItemQuantity(cartItemId, quantity) {
    try {
      const { data } = await axios.put(`/api/cart/${cartItemId}`, { quantity });

      // Update only the specific item's quantity in state
      const updatedCart = { ...carts };
      updatedCart.items = carts.items.map((item) =>
        item._id === cartItemId
          ? { ...item, quantity: data.cart.items.find(i => i._id === cartItemId)?.quantity || quantity }
          : item
      );
      setCarts(updatedCart);
    } catch (error) {
      console.error("Failed to update cart item quantity:", error);
    }
  }

  return (
    <CartContext.Provider value={{ carts, loading, fetchCart, addToCart, deleteCartItem, updateCartItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export const CartData = () => useContext(CartContext);