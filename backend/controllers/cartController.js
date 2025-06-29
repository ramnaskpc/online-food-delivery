import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { itemId } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData || {}; 

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Product added to cart" });

  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, quantity } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData || {};

    cartData[itemId] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Cart updated" });

  } catch (error) {
    console.error("Update Cart Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData || {};
    res.json({ success: true, cartData });

  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
