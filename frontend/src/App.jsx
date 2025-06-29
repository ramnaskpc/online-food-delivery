import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Order from './pages/Order/Order';
import { ToastContainer } from 'react-toastify';
import FoodContextProvider from './context/FoodContext'; 
import 'react-toastify/dist/ReactToastify.css';
import FoodCollection from './components/FoodCollection/FoodCollection';
import Profile from "./pages/Profile/Profile"
import EditProfile from './pages/EditProfile/EditProfile';
import Wishlist from './pages/WishList/WishList';
import ProductDetails from './pages/ProductDetails/Productdetails';


export const backendUrl = "http://localhost:8083";

const App = () => {
  return (
    <FoodContextProvider> 
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/orders' element={<Order />} />
          <Route path="/menu" element={<FoodCollection />} />
          <Route path="/product/:id" element={<ProductDetails/>} />
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
        <ToastContainer />
    </FoodContextProvider>
  );
};

export default App;
