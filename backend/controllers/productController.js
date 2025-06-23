import productModel from "../models/productModel.js";
import fs from "fs";
import {v2 as cloudinary} from "cloudinary"


const addProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const image = req.file;

    if (!image) {
      return res.status(400).json({ success: false, message: "Please upload an image" });
    }

    const result = await cloudinary.uploader.upload(image.path, {
      resource_type: "image",
    });

    const newProduct = await productModel.create({
      name,
      description,
      category,
      price: Number(price),
      image: result.secure_url,
      date: Date.now(),
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Add Product Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("List Product Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body._id); 
    res.json({ success: true, message: "Product removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
     res.json({success:true, product})
   
  } catch (error) {
   console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, listProduct, removeProduct, singleProduct };
