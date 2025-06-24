import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiUser, BiCart } from 'react-icons/bi';
import './Navbar.css';
import { FoodContext } from '../../context/FoodContext';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { getCartCount, token, setToken } = useContext(FoodContext);

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setShowDropdown(false);
  };

  const handleNavigation = (path) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    navigate(path);
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

        <div className="icons">
          <div className="profile-group">
            <BiUser className="icon" onClick={toggleDropdown} />
            
            {showDropdown && (
              <div className="dropdown-menu">
                {!token && <Link to="/login"><p className="dropdown-item">Login/Signup</p></Link>}
                {token && (
                  <>
                    <Link to="/orders"><p className="dropdown-item">Orders</p></Link>
                    <p onClick={logout} className="dropdown-item">Logout</p>
                  </>
                )}
              </div>
            )}
          </div>

          <button className="cart-icon" onClick={() => handleNavigation('/cart')}>
            <BiCart className="icon" />
            <span className="cart-qty">{getCartCount()}</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
