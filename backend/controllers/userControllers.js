import userModel from "../models/userModel.js"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const createToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET)
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect password" });
    }

    const token = createToken(user._id);
    res.status(200).json({ success: true, message: "Login successful", token });
    
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



const registerUser = async (req, res) => {
  try {
    const { name, email, password, address = {} } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email address" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Please enter a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      address: {
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        zip: address.zip || ''
      }
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, message: "Account created successfully", token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
     const token = jwt.sign(
  { email }, 
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);


      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid login details" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


 const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json({ success: true, user }); 
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


const updateUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, address } = req.body;

    if (name) user.name = name;
    if (address) user.address = address;

    await user.save();

    res.json({ success: true, message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



 const getSavedAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      addresses: user.addresses || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


  const addAddress = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const newAddress = req.body;

    if (!newAddress.firstName || !newAddress.street) {
      return res.status(400).json({ success: false, message: "Address is incomplete" });
    }

    user.addresses.push(newAddress);
    await user.save();

    res.json({ success: true, message: "Address added successfully", addresses: user.addresses });
  } catch (error) {
    console.error("Add Address Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




export {loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, getSavedAddresses ,addAddress}