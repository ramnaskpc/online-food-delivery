import express from "express"
import { addProduct, listProduct, removeProduct, singleProduct } from "../controllers/productController.js"
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();


productRouter.post('/add', upload.single("image") ,adminAuth, addProduct)
productRouter.get('/list', listProduct)
productRouter.post('/remove', adminAuth, removeProduct)
productRouter.post('/single', singleProduct);

export default productRouter