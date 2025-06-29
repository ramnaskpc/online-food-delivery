import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiCart } from 'react-icons/bi';
import './Navbar.css';
import { FoodContext } from '../../context/FoodContext';
import { useLocation } from 'react-router-dom';


const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { getCartCount, token, setToken } = useContext(FoodContext);

  const location = useLocation();
const hideSearchBar = location.pathname === '/login';

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div>
          <Link to="/"><h2>Zesty Bite</h2></Link>
        </div>

     {!hideSearchBar && (
  <div className="search-bar">
    <input
      type="text"
      className="search-input"
      placeholder="Search for food..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
    />
    <button className="search-button" onClick={handleSearch}>Search</button>
  </div>
)}

        <div className="nav-buttons">
         {!token ? (
  <Link to="/login"><button className="nav-btn">Login / Signup</button></Link>
) : (
  <>
    <Link to="/orders"><button className="nav-btn">My Orders</button></Link>
    <button className="nav-btn" onClick={logout}>Logout</button>
    <Link to="/profile"><button className="nav-btn">Profile</button></Link> 
   <Link to="/wishlist"><button className="nav-btn">Wishlist</button></Link>

  </>
)}


          <button className="cart-icon" onClick={() => navigate('/cart')}>
            <BiCart className="icon" />
            <span className="cart-qty">{getCartCount()}</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
