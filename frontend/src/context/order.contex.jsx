import axios from 'axios';
import { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export const OrderContextProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all orders for the logged-in user
  async function fetchOrders() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get('/api/order/all');
      setOrders(data.orders);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
      setLoading(false);
    }
  }

  // Fetch a single order by ID
  async function fetchOrderById(id) {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`/api/order/${id}`);
      setLoading(false);
      return { success: true, order: data.order };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order');
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Failed to fetch order' };
    }
  }

  // Fetch the current (pending) order
  async function fetchCurrentOrder() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get('/api/order/current');
      setCurrentOrder(data.order);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'No current order found');
      setCurrentOrder(null);
      setLoading(false);
    }
  }

  // Create a new order
  async function createOrder({ products, paymentMethod, addressNum }) {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post('/api/order', { products, paymentMethod, addressNum });
      setLoading(false);
      return { success: true, order: data.order };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Failed to create order' };
    }
  }

  // Update order status
  async function updateOrderStatus(id, status) {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.put(`/api/order/${id}/status`, { status });
      setLoading(false);
      return { success: true, order: data.order };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Failed to update order status' };
    }
  }

  // Delete an order
  async function deleteOrder(id) {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/order/${id}`);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete order');
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Failed to delete order' };
    }
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        loading,
        error,
        fetchOrders,
        fetchOrderById,
        fetchCurrentOrder,
        createOrder,
        updateOrderStatus,
        deleteOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const OrderData = () => useContext(OrderContext);
