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

  const loadOrderData = async()=> {
    try {
      if (!token) return;

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
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
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    }
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
                <img src={item.image} alt="" className='order-item-image' />
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
                 <button onClick={loadOrderData} className='track-order-btn'>Track Order</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Order;
