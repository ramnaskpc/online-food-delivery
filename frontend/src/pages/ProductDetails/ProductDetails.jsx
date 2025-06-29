import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { FoodContext } from '../../context/FoodContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { products, addToCart } = useContext(FoodContext);

  const product = products.find(p => p._id === id);

  if (!product) return <p>Product not found</p>;

  return (
    <div className="product_page">
      <div className="product_card2">
        <img src={product.image} alt={product.name} />
        <h1>{product.name}</h1>
        <p className="description">{product.description}</p>
        <h2 className="price">₹{product.price}</h2>
        <button onClick={() => addToCart(product._id)}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductDetails;
