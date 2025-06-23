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
        </Routes>
        <ToastContainer />
      
    </FoodContextProvider>
  );
};

export default App;
