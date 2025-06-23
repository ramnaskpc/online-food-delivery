import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { product}  from "../assets/assets";
import { backendUrl } from "../../../admin/admin/src/App";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; 

export const FoodContext = createContext();

const FoodContextProvider = ({ children }) => {
  const navigate = useNavigate(); 
  const delivery_fee = 12;
  const currency = '$';
  const [products, setProducts] = useState(product);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const getCartCount = () => {
  return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
};

  


  const addToCart = async(itemId) => {
  const updatedCart = { ...cartItems };
  updatedCart[itemId] = (updatedCart[itemId] || 0) + 1;
  setCartItems(updatedCart);
  console.log(`${itemId} added to cart`)
  toast.success("Added to cart");

  if (token) {
    try {
      await axios.post(`${backendUrl}/api/cart/add`,
        { itemId },
        { headers: { token } }
      );

   
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }
};

  const updateQuantity = async(itemId, quantity)=>{
    const cartData = {...cartItems};
    cartData[itemId] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/update`,{itemId, quantity},{headers: {token}});
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
      const itemInfo = products.find((product) => product._id === itemId);
      return itemInfo ? total + itemInfo.price * quantity : total;
    }, 0);
  };

  const getProductData = async() => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUsercart = async(token) => {
    try {
      const response = await axios.post(`${backendUrl}/api/cart/get`, {},
         {headers: {token}});

      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };




  useEffect(() => {
    getProductData();
  },[]);

  useEffect(()=>{
    if (!token && localStorage.getItem("token")){
     setToken(localStorage.getItem('token'));
     getUsercart(localStorage.getItem('token'))
   }
  },[])

  return (
    <FoodContext.Provider
      value={{
        products,
        cartItems,
        navigate,
        setCartItems,
        currency,
        addToCart,
        delivery_fee,
        updateQuantity,
        getCartAmount,
        token,
        setToken,
        getUsercart,
        getCartCount
      }}
    >
      {children}
    </FoodContext.Provider>
  );
};

export default FoodContextProvider;
