import React, { useEffect, useState } from 'react';
import { OrderData } from '../context/order.contex.jsx';
import { Loading } from '../components/Loading.jsx';

const Order = () => {
  const { orders, loading, fetchOrders } = OrderData();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  if (loading) return <Loading />;

  // Filter and sort logic (simple demo)
  let filteredOrders = orders.filter(order => {
    // Calculate dynamic status for filtering
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24)) + 1;
    let deliveryDays = 4;
    if (order.products.length > 0 && order.products[0].productId?.timeToDeliver) {
      const match = String(order.products[0].productId.timeToDeliver).match(/\d+/);
      if (match) deliveryDays = parseInt(match[0], 10);
    }
    let status = 'pending';
    if (diffDays >= deliveryDays) status = 'delivered';
    else if (diffDays === 3) status = 'dispatched';
    else if (diffDays === 2) status = 'shipped';
    // else status = 'pending';
    if (search && !order._id.includes(search)) return false;
    if (statusFilter !== 'all' && status !== statusFilter) return false;
    if (paymentFilter !== 'all' && order.paymentMethod !== paymentFilter) return false;
    return true;
  });
  if (sort === 'latest') filteredOrders = filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (sort === 'oldest') filteredOrders = filteredOrders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div className="order-page-layout">
      {/* Left: Order Cards */}
      <div className="order-list">
        <h2 className="order-page-title">My Orders</h2>
        {filteredOrders.length === 0 ? (
          <div className="order-empty">No orders found.</div>
        ) : (
          filteredOrders.map(order => {
            // Calculate dynamic status for the order header
            const orderDate = new Date(order.createdAt);
            const now = new Date();
            const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24)) + 1;
            let deliveryDays = 4;
            if (order.products.length > 0 && order.products[0].productId?.timeToDeliver) {
              const match = String(order.products[0].productId.timeToDeliver).match(/\d+/);
              if (match) deliveryDays = parseInt(match[0], 10);
            }
            let status = 'Pending';
            if (diffDays >= deliveryDays) status = 'Delivered';
            else if (diffDays === 3) status = 'Dispatched';
            else if (diffDays === 2) status = 'Shipped';
            // else status = 'Pending';
            return (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div><b>Order ID:</b> {order._id}</div>
                  <div><b>Date:</b> {new Date(order.createdAt).toLocaleDateString()}</div>
                  <div><b>Status:</b> <span className={`order-status order-status-${status.toLowerCase()}`}>{status}</span></div>
                  <div><b>Payment:</b> {order.paymentMethod}</div>
                  <div><b>Total:</b> ₹{order.totalAmount}</div>
                </div>
                <div className="order-card-products">
                  {order.products.map(item => (
                    <div key={item.productId?._id || item.productId} className="order-product-card">
                      <img src={item.productId?.image?.url} alt={item.productId?.name} className="order-product-img-pro" />
                      <div className="order-product-info-pro">
                        <div className="order-product-name-pro">{item.productId?.name}</div>
                        <div className="order-product-qty-pro">Qty: {item.quantity}</div>
                        <div className="order-product-price-pro">₹{item.productId?.newprice}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* Right: Filter/Sort/Search Sidebar */}
      <aside className="order-filter-sidebar">
        <div className="order-filter-box">
          <h3>Filter & Sort</h3>
          <input
            className="order-filter-search"
            type="text"
            placeholder="Search Order ID"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="order-filter-group">
            <label>Status:</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
          <div className="order-filter-group">
            <label>Payment:</label>
            <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Online">Online</option>
            </select>
          </div>
          <div className="order-filter-group">
            <label>Sort:</label>
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Order;