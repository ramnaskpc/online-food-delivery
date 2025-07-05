import Product from '../models/productModel.js';

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const review = {
      user: userId,
      name: req.user.name,
      rating,
      comment,
      date: new Date()
    };

    product.reviews.push(review);
    await product.save();

    res.status(201).json({ success: true, message: "Review added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, reviews: product.reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;

    
    const product = await Product.findOne({ "reviews._id": reviewId });
    if (!product) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    
    const reviewIndex = product.reviews.findIndex(
      (rev) => rev._id.toString() === reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    
    const review = product.reviews[reviewIndex];
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this review" });
    }

    
    product.reviews.splice(reviewIndex, 1);
    await product.save();

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
