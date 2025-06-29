import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FoodContext } from '../../context/FoodContext';
import { categoryItem } from '../../assets/assets';
import './FoodCollection.css';

const FoodCollection = () => {
  const { products, addToCart, wishlist, toggleWishlist, isWishlisted } = useContext(FoodContext);
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search')?.toLowerCase() || '';
    setSearchQuery(query);
  }, [location.search]);

  const filteredProducts = products.filter(product =>
    (category === "All" || product.category === category) &&
    product.name.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="food_container">
      <div className="header_section">
        <h1>Discover Our Menu</h1>
        <hr className='divider' />
      </div>

      <div className="display_container">
        <div className="category_section">
          <h1>Explore our categories</h1>
          <ul className="category_list">
            {categoryItem.map((item, index) => (
              <li
                key={index}
                onClick={() => setCategory(prev => prev === item.category_title ? "All" : item.category_title)}
                className={category === item.category_title ? "active" : ""}
              >
                {item.category_title}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid_display">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product._id} className='product_card'>
                <Link to={`/product/${product._id}`} className="product_link">
                  <div className="product_image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                </Link>

                <div className="price_add">
                  <p>₹{product.price}</p>
                  <button onClick={() => addToCart(product._id)}>Add To Cart</button>
                </div>

                <div
                  className={`wishlist-icon-below ${isWishlisted(product._id) ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product._id);
                  }}
                  title="Toggle Wishlist">
                  ❤️ {isWishlisted(product._id) ? "Wishlisted" : "Add to Wishlist"}
                </div>
              </div>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCollection;
