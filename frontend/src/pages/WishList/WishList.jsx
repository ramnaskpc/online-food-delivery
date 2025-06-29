import React, { useContext } from 'react';
import { FoodContext } from '../../context/FoodContext';
import { Link } from 'react-router-dom';
import './Wishlist.css';

const Wishlist = () => {
  const { products, wishlist, toggleWishlist, addToCart } = useContext(FoodContext);

  const wishlistItems = products.filter(product => wishlist.includes(product._id));

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page">
        <h2>Your Wishlist is Empty</h2>
        <p>Browse our menu and add your favorite items ❤️</p>
        <Link to="/menu" className="browse-link">Go to Menu</Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h2>Your Wishlist ❤️</h2>
      <div className="wishlist-grid">
        {wishlistItems.map(product => (
          <div key={product._id} className="wishlist-card">
            <Link to={`/product/${product._id}`}>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
            </Link>
            <div className="wishlist-actions">
              <span className="price">₹{product.price}</span>
              <button onClick={() => addToCart(product._id)}>Add to Cart</button>
              <button onClick={() => toggleWishlist(product._id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
