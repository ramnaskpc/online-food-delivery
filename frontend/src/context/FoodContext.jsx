import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { product } from "../assets/assets";
import { backendUrl } from "../../../admin/admin/src/App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const FoodContext = createContext();

const FoodContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const delivery_fee = 12;
  const currency = "₹";

  const [products, setProducts] = useState(product);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [wishlist, setWishlist] = useState([]);
  const isLoggedIn = !!token;

  const getCartCount = () => {
    return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
  };

  const toggleWishlist = async (productId) => {
    if (!token) {
      toast.error("Login to add to wishlist");
      return;
    }

    const isAlreadyWishlisted = wishlist.includes(productId);

    try {
      if (isAlreadyWishlisted) {
        await axios.delete(`${backendUrl}/api/wishlist/remove`, {
          data: { productId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(wishlist.filter((id) => id !== productId));
      } else {
        await axios.post(
          `${backendUrl}/api/wishlist/add`,
          { productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlist([...wishlist, productId]);
      }
    } catch (error) {
      console.error("Wishlist toggle failed", error);
      toast.error("Something went wrong while updating wishlist.");
    }
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  const addToCart = async (itemId) => {
    const updatedCart = { ...cartItems };
    updatedCart[itemId] = (updatedCart[itemId] || 0) + 1;
    setCartItems(updatedCart);
    toast.success("Added to cart");

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error(error);
        toast.error("Unauthorized: Please log in again.");
      }
    } else {
      toast.error("You must be logged in to add to cart.");
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    const cartData = { ...cartItems };
    cartData[itemId] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.log(error);
        toast.error("Unauthorized: Please log in again.");
      }
    }
  };

  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
      const itemInfo = products.find((product) => product._id === itemId);
      return itemInfo ? total + itemInfo.price * quantity : total;
    }, 0);
  };

  const getProductData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load products.");
    }
  };

  const getUserCart = async (tokenValue) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { Authorization: `Bearer ${tokenValue}` } }
      );

      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch cart.");
    }
  };

  const fetchWishlist = async (tokenValue) => {
    try {
      const response = await axios.get(`${backendUrl}/api/wishlist`, {
        headers: { Authorization: `Bearer ${tokenValue}` },
      });
      setWishlist(response.data.wishlist || []);
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
      setWishlist([]);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setWishlist([]);
    setCartItems({});
    navigate("/login");
  };

  useEffect(() => {
    getProductData();
  }, []);

  useEffect(() => {
    if (token) {
      getUserCart(token);
      fetchWishlist(token);
    } else {
      setWishlist([]);
      setCartItems({});
    }
  }, [token]);

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
        getUserCart,
        getCartCount,
        wishlist,
        toggleWishlist,
        isWishlisted,
        logout,
        isLoggedIn,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
};

export default FoodContextProvider;
