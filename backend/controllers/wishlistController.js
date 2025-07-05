import userModel from '../models/userModel.js';
import productModel from '../models/productModel.js';


 const getWishlist = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).populate('wishlist');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      wishlist: user.wishlist.map(product => product._id.toString())
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

 const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.status(200).json({ success: true, message: "Added to wishlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
};


  const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to remove from wishlist" });
  }
};

export {removeFromWishlist, addToWishlist, getWishlist}