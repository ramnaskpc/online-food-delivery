import express from 'express';
import cors from 'cors';
import 'dotenv/config'; 
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoute.js';
import adminRouter from "./routes/adminRoute.js"
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoute.js';
import reviewRoute from './routes/reviewRoute.js';
import wishlistRoute from "./routes/wishlistRoute.js";



const app = express();
const port = process.env.PORT || 8083;


connectDB();
connectCloudinary()

app.use(express.json());
app.use(cors());


app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/admin",  adminRouter );
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use('/api', reviewRoute);
app.use('/api/wishlist', wishlistRoute);




app.listen(port, () => {
  console.log('Server started on port: '+ port);
});
