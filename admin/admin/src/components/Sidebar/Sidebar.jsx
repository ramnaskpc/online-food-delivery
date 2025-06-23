import React from 'react';
import { NavLink } from 'react-router-dom';
import { IoLogOut } from "react-icons/io5";
import { MdAddCircleOutline, MdFormatListBulleted, MdAddShoppingCart } from "react-icons/md";
import "./Sidebar.css";

const Sidebar = ({ setToken }) => {
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken(null); 
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h2>Zesty Bite</h2>
      </div>
      <div className="sidebar-links">
        <NavLink className='sidebar-link' to="/add">
          <MdAddCircleOutline className='sidebar-icon' />
          <p className="sidebar-text">Add Product</p>
        </NavLink>

        <NavLink className='sidebar-link' to="/list">
          <MdFormatListBulleted className="sidebar-icon" />
          <p className="sidebar-text">List Product</p>
        </NavLink>

        <NavLink className='sidebar-link' to="/orders">
          <MdAddShoppingCart className='sidebar-icon' />
          <p className='sidebar-text'>Orders</p>
        </NavLink>

        <button className="sidebar-link" onClick={handleLogout}>
          <IoLogOut className="sidebar-icon" />
          <p className='sidebar-text'>Logout</p>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
