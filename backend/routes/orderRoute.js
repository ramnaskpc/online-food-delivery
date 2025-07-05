import express from 'express';
import adminAuth from "../middleware/adminAuth.js";
import authUser from '../middleware/auth.js';
import  {listOrdersPaginated} from "../controllers/orderController.js";
import  {deleteOrder} from "../controllers/orderController.js";
import {
  placeOrder,
  placeOrderStripe,
  allOrder,
  userOrder,
  updateStatus
} from '../controllers/orderController.js';  
const orderRouter = express.Router();

orderRouter.post('/list', adminAuth, allOrder);
orderRouter.post('/status', adminAuth, updateStatus);

orderRouter.post("/place", authUser, placeOrder);
orderRouter.post('/stripe', authUser, placeOrderStripe);

orderRouter.post('/userorders', authUser, userOrder);

orderRouter.get("/paginated", adminAuth, listOrdersPaginated);
orderRouter.delete("/delete/:orderId", adminAuth, deleteOrder);


export default orderRouter;
