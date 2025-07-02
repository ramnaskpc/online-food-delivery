import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FoodContext } from '../../context/FoodContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { products, addToCart } = useContext(FoodContext);

  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [reviews, setReviews] = useState([
   
  ]);

  const product = products.find(p => p._id === id);

  if (!product) return <p className="not-found">Product not found</p>;

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (newReview.trim()) {
      const newEntry = {
        user: 'You', 
        rating: newRating,
        comment: newReview,
      };
      setReviews([...reviews, newEntry]);
      setNewReview('');
      setNewRating(5);
    }
  };

  const handleDeleteReview = (index) => {
    const updated = [...reviews];
    updated.splice(index, 1); 
    setReviews(updated);
  };

  return (
    <div className="product_page">
      <div className="product_card2">
        <img src={product.image} alt={product.name} className="product_image" />
        <div className="product_info">
          <h1>{product.name}</h1>
          <p className="description">{product.description}</p>
          <h2 className="price">₹{product.price}</h2>
          <button className="add_to_cart" onClick={() => addToCart(product._id)}>Add to Cart</button>
        </div>
      </div>

      <div className="review_section">
        <h3>Customer Reviews</h3>
        {reviews.length === 0 && <p>No reviews yet. Be the first to review!</p>}
        <div className="review_cards">
          {reviews.map((r, i) => (
            <div className="review_card" key={i}>
              <div className="review_header">
                <strong>{r.user}</strong>
                <span className="review_rating">⭐ {r.rating}/5</span>
              </div>
              <p>{r.comment}</p>
              {r.user === 'You' && (
                <button
                  className="delete_btn"
                  onClick={() => handleDeleteReview(i)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleReviewSubmit} className="review_form">
          <label htmlFor="rating">Rating:</label>
          <select
            id="rating"
            value={newRating}
            onChange={(e) => setNewRating(parseInt(e.target.value))}
          >
            <option value={5}>5 - Excellent</option>
            <option value={4}>4 - Good</option>
            <option value={3}>3 - Average</option>
            <option value={2}>2 - Poor</option>
            <option value={1}>1 - Terrible</option>
          </select>

          <textarea
            placeholder="Write your review here..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            rows="4"
          />
          <button type="submit">Submit Review</button>
        </form>
      </div>
    </div>
  );
};

export default ProductDetails;
