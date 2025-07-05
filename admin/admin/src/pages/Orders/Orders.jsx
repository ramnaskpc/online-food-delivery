import React, { useState, useEffect } from 'react';
import axios from "axios";
import { backendUrl, currency } from '../../App';
import { toast } from "react-toastify";
import "./Orders.css";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAllOrders = async (pageNum = 1) => {
    if (!token) return;

    try {
      const response = await axios.get(
        `${backendUrl}/api/order/paginated?page=${pageNum}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
        setPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      } else {
        toast.error(response.data.message || "Failed to fetch orders.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching orders.");
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: event.target.value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        fetchAllOrders(page);
        toast.success("Order status updated");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };


  const deleteOrder = async (orderId) => {
  if (!window.confirm("Are you sure you want to delete this order?")) return;

  try {
    const response = await axios.delete(`${backendUrl}/api/order/delete/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data.success) {
      toast.success("Order deleted successfully");
      fetchAllOrders(page); 
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete order");
  }
};

  useEffect(() => {
    fetchAllOrders(1);
  }, [token]);

  return (
    <div>
      <h3 className="order-title">All Orders</h3>
      <div className="order-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Telephone</th>
              <th>Shipping Address</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Items</th>
              <th>Price</th>
              <th>Payment Method</th>
              <th>Payment Status</th>
              <th>Date</th>
              <th>Delivery Status</th>
              <th>Delete</th>

            </tr>
          </thead>
          <tbody className="table-body">
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.address.firstName}</td>
                <td>{order.address.email}</td>
                <td>{order.address.phone}</td>
                <td>
                  {order.address.street}, {order.address.city}, {order.address.state},{" "}
                  {order.address.country}, {order.address.zipcode}
                </td>
                <td>
                  {order.items.map((item, i) => (
                    <p key={i}>{item.name}</p>
                  ))}
                </td>
                <td>
                  {order.items.map((item, i) => (
                    <p key={i}>{item.quantity}</p>
                  ))}
                </td>
                <td>{order.items.length}</td>
                <td>{currency}{order.amount}</td>
                <td>{order.paymentMethod}</td>
                <td>{order.payment ? "Done" : "Pending"}</td>
                <td>{new Date(order.date).toLocaleString()}</td>
                <td>
                  <select
                    onChange={(event) => statusHandler(event, order._id)}
                    value={order.status}
                    className="order-status"
                  >
                    <option value="Order placed">Order placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                  <td>
                     <button
                     onClick={() => deleteOrder(order._id)}
                     className="delete-btn">
                     Delete
                     </button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => fetchAllOrders(page - 1)} disabled={page === 1}>
               Previous
            </button>
            <span className='center'>Page {page} of {totalPages}</span>
            <button onClick={() => fetchAllOrders(page + 1)} disabled={page === totalPages}>
              Next 
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
