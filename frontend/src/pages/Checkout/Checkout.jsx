import React, { useContext, useState, useEffect } from 'react';
import stripe from '../../assets/stripe_logo.png';
import CartTotal from "../../components/CartTotal/CartTotal";
import './Checkout.css';
import { FoodContext } from '../../context/FoodContext';
import { backendUrl } from '../../App';
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [method, setMethod] = useState("cod");
  const navigate = useNavigate();

  const {
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    token,
    products
  } = useContext(FoodContext);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    zipcode: "",
    state: "",
    phone: "",
    country: ""
  });

  useEffect(() => {
    const fetchSavedAddresses = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/user/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setSavedAddresses(res.data.addresses);
        }
      } catch (err) {
        console.error("Error fetching addresses", err);
      }
    };

    if (token) fetchSavedAddresses();
  }, [token]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const saveAddressHandler = async () => {
  try {
    const res = await axios.post(`${backendUrl}/api/user/addresses`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data.success) {
      toast.success("Address saved successfully");
      setSavedAddresses(res.data.addresses); 
      setFormData({  
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        zipcode: "",
        state: "",
        phone: "",
        country: ""
      });
    } else {
      toast.error(res.data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to save address");
    console.error("Error saving address:", error);
  }
};


  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("You must be logged in to place an order.");
      return;
    }

    try {
      const orderItems = Object.entries(cartItems).map(([itemId, quantity]) => {
        const itemInfo = products.find((product) => product._id === itemId);
        return itemInfo ? { ...itemInfo, quantity } : null;
      }).filter(Boolean);

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      if (method === "cod") {
        const response = await axios.post(`${backendUrl}/api/order/place`, orderData, config);
        if (response.data.success) {
          setCartItems({});
          toast.success("Order placed successfully");
          navigate("/orders");
        } else {
          toast.error(response.data.message);
        }
      }

      if (method === "stripe") {
        const response = await axios.post(`${backendUrl}/api/order/stripe`, orderData, config);
        if (response.data.success) {
          const { session_url } = response.data;
          window.location.replace(session_url);
        } else {
          toast.error(response.data.message);
        }
      }

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <form className='form-container' onSubmit={onSubmitHandler}>
        <div className='form-left'>
          <fieldset className='payment-method'>
            <legend>Payment Options</legend>
            <div className='payment-options'>
              <div
                onClick={() => setMethod("stripe")}
                className={`payment-option ${method === "stripe" ? "selected" : ""}`}
              >
                <img src={stripe} alt='Stripe' />
              </div>
              <div
                onClick={() => setMethod("cod")}
                className={`payment-option ${method === "cod" ? "selected" : ""}`}
              >
                <span className='payment-text'>CASH ON DELIVERY</span>
              </div>
            </div>
          </fieldset>

          <div className='form-title'>
            <h2>Shipping Address</h2>
          </div>

          <div className="saved-addresses">
            <h3>Select from saved addresses</h3>
            {savedAddresses.length === 0 && <p>No saved addresses found.</p>}
            {savedAddresses.map((addr, index) => (
              <div
                key={index}
                className={`address-card ${selectedAddressIndex === index ? "selected" : ""}`}
                onClick={() => {
                  if (selectedAddressIndex === index) {
                    setSelectedAddressIndex(null);
                    setFormData({
                      firstName: "",
                      lastName: "",
                      email: "",
                      street: "",
                      city: "",
                      zipcode: "",
                      state: "",
                      phone: "",
                      country: ""
                    });
                  } else {
                    setSelectedAddressIndex(index);
                    setFormData(addr);
                  }
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedAddressIndex === index}
                  readOnly
                />
                <label>
                  {addr.firstName} {addr.lastName}, {addr.street}, {addr.city}, {addr.state}, {addr.zipcode}, {addr.country}, {addr.phone}
                </label>
              </div>
            ))}
          </div>

          <div className="form-row">
            <input type="text" name="firstName" value={formData.firstName} onChange={onChangeHandler} className='form-input' placeholder='First Name' />
            <input type="text" name="lastName" value={formData.lastName} onChange={onChangeHandler} className='form-input' placeholder='Last Name' />
          </div>

          <input type='email' name="email" value={formData.email} onChange={onChangeHandler} className='form-input' placeholder='Email Address' />
          <input type='text' name="phone" value={formData.phone} onChange={onChangeHandler} className='form-input' placeholder='Phone Number' />
          <input type='text' name="street" value={formData.street} onChange={onChangeHandler} className='form-input' placeholder="Street Address" />

          <div className='form-row'>
            <input type='text' name="city" value={formData.city} onChange={onChangeHandler} className='form-input' placeholder='City' />
            <input type='text' name="state" value={formData.state} onChange={onChangeHandler} className='form-input' placeholder='State' />
          </div>

          <div className='form-row'>
            <input type='text' name="zipcode" value={formData.zipcode} onChange={onChangeHandler} className='form-input' placeholder='Zipcode' />
            <input type='text' name="country" value={formData.country} onChange={onChangeHandler} className='form-input' placeholder='Country' />

            <button
           type="button"
           className="saved-address"
           onClick={saveAddressHandler}
           >
           SAVE ADDRESS
          </button>

          </div>
        </div>

        <div className='form-right'>
          <CartTotal />
          <div className='form-submit'>
            <button type='submit' className='submit-button'>PLACE ORDER</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
