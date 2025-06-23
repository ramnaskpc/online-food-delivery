import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "./components/Sidebar/Sidebar";
import Login from './components/Login/Login';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import Add from './pages/Add/Add'; 

export const backendUrl = "http://localhost:8083";
export const currency = "$"
const App = () => {
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('adminToken');
    return savedToken && savedToken !== 'undefined' ? savedToken : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token);
    } else {
      localStorage.removeItem('adminToken');
    }
  }, [token]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="app-container">
        <div className="app-divider">
         {!token ? (
  <Login setToken={setToken} />
) : (
  <div className="app-content">
    <Sidebar setToken={setToken} />
    <div className="page-content">
      <Routes>
        <Route path="/" element={<Navigate to="/add" replace />} />
        <Route path="/add" element={<Add token={token} />} />
        <Route path="/list" element={<List token={token} />} />
        <Route path="/orders" element={<Orders token={token} />} />
      </Routes>
    </div>
  </div>
)}

         
        </div>
      </div>
    </>
  );
};

export default App;
