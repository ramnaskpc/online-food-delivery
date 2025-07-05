import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FoodContext } from '../../context/FoodContext';
import { backendUrl } from '../../App';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { products, addToCart } = useContext(FoodContext);

  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [reviews, setReviews] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/review/${id}`);
        if (res.data.success) {
          setReviews(res.data.reviews);
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setCurrentUserId(res.data.user._id);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchReviews();
    fetchCurrentUser();
  }, [id]);

  const product = products.find(p => p._id === id);
  if (!product) return <p className="not-found">Product not found</p>;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You must be logged in to submit a review");
      return;
    }

    if (!newReview.trim()) return;

    try {
      const res = await axios.post(
        `${backendUrl}/api/review/${id}`,
        { rating: newRating, comment: newReview },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setNewReview('');
        setNewRating(5);
        const updated = await axios.get(`${backendUrl}/api/review/${id}`);
        if (updated.data.success) {
          setReviews(updated.data.reviews);
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.delete(`${backendUrl}/api/review/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setReviews(reviews.filter((r) => r._id !== reviewId));
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
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
              <strong>{r.name || 'you'}</strong>
                <span className="review_rating">⭐{r.rating}/5</span>
              </div>
              <p>{r.comment}</p>
              <p className="review_date">{new Date(r.date).toLocaleString()}</p>

              {String(currentUserId) === String(r.user) && (
                <button className="delete_button" onClick={() => handleDeleteReview(r._id)}>
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
            required
          />
          <button type="submit">Submit Review</button>
        </form>
      </div>
    </div>
  );
};

export default ProductDetails;
