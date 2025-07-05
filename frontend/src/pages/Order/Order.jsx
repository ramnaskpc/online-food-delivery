import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { FoodContext } from "../../context/FoodContext";
import { backendUrl } from '../../App';
import { useNavigate } from "react-router-dom";
import './Order.css';

const Order = () => {
  const { token, currency } = useContext(FoodContext);
  const [orderData, setOrderData] = useState([]);
  const navigate = useNavigate();

  const loadOrderData = async () => {
    try {
      if (!token) {
        console.warn("No token found, user must login");
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        let allOrdersItem = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item.status = order.status;
            item.payment = order.payment;
            item.paymentMethod = order.paymentMethod;
            item.date = order.date;
            allOrdersItem.push(item);
          });
        });

        setOrderData(allOrdersItem.reverse());
      } else {
        console.error("Failed to load orders:", response.data.message);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };


 const downloadInvoice = (item) => {
  const line = "----------------------------------------";

  const invoiceContent = `
            INVOICE / ORDER BILL
${line}
Product Name : ${item.name}
Price        : ${currency}${item.price}
Quantity     : ${item.quantity}
Total        : ${currency}${(item.price * item.quantity).toFixed(2)}
Payment Mode : ${item.paymentMethod}
Order Status : ${item.status}
Order Date   : ${new Date(item.date).toLocaleString()}
${line}
Thank you for your order!
Visit again at Our Zesty Bite App 
${line}
`;

  const blob = new Blob([invoiceContent], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Invoice_${item.name.replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="order-container">
      <div className="order-title">
        <h1>My Orders</h1>
      </div>
      <div>
        {orderData.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orderData.map((item, index) => (
            <div className="order-item-container" key={index}>
              <div className="order-item-details">
                <img src={item.image} alt={item.name} className='order-item-image' />
                <div>
                  <p className="order-item-name">{item.name}</p>
                  <div className="order-item-info">
                    <p>{currency}{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <p className='order-item-date'>
                    Date: <span>{new Date(item.date).toLocaleString()}</span>
                  </p>
                  <p className='order-item-payment'>
                    Payment: <span>{item.paymentMethod}</span>
                  </p>
                </div>
              </div>
              <div className="order-item-status-container">
                <div className="order-item-status">
                  <div className="status-indicator"></div>
                  <p>{item.status}</p>
                </div>
             <button onClick={() => downloadInvoice(item)} className='track-order-btn'>Download Invoice</button>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Order;
