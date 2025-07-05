import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe"


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const currency = 'usd'
const deliveryCharge =12

const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { amount, address, street, price } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" }); 
    }

    if (!userData.cartData || Object.keys(userData.cartData).length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const items = await Promise.all(
      Object.entries(userData.cartData).map(async ([itemId, quantity]) => {
        const product = await productModel.findById(itemId);
        if (!product) throw new Error("Product not found");

        return {
          itemId,
          name: product.name,
          image: product.image,
          price: product.price,
          street: product.street,
          quantity,
        };
      })
    );

    const orderData = {
      userId,
      items,
      amount,
      address,
      street,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    
    userData.cartData = {};
    await userData.save();

    return res.json({ success: true, message: "Order placed" });

  } catch (error) {
    console.error("Place Order Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};


const placeOrderStripe = async(req, res)=>{
    try {
       const {amount, address}= req.body;
       const {origin} = req.headers;

        const userId = req.user.id;

       const userData = await userModel.findById(userId)
       if(!userData){
         return res.json({success:false, message:"user not found"})
       }

       const items = await Promise.all(
        Object.entries(userData.cartData).map(async ([itemId, quantity ])=>{
          const product = await productModel.findById(itemId);

          return{
            itemId,
            name:product.name, image:product.image,
            price:product.price,
            quantity
          }
        })
       )
        if(items.length===0){
          return res.json({success:false, message:"cart is empty"})
        }

       const orderData={
           userId,
           items,
           amount,
           address,
           paymentMethod:"Stripe",
           payment:true,
           date:Date.now()
       }


       const newOrder = new orderModel(orderData)
       await newOrder.save()

      const line_items = []
       line_items.push({
        price_data:{
          currency:currency,
        product_data:{name:"delivery charge"},
        unit_amount:deliveryCharge * 100
        },
        quantity: 1
       })

       const session = await stripe.checkout.sessions.create({
            success_url:`${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode:"payment"
       })
    
       res.json({success:true, session_url:session.url})
    } catch (error) {
       console.log(error);
    }
 
};



const allOrder = async(req, res)=>{
  try {
    const orders = await orderModel.find({});
    res.json({ success:true, orders});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Could not fetch orders" });
  }
};




const userOrder = async(req, res)=>{
  try {
    const userId = req.user.id;
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({success:true, orders});
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Could not fetch user orders" });
  }
};

const updateStatus = async(req, res)=>{
  try {
    const {orderId, status} = req.body;
    await orderModel.findByIdAndUpdate(orderId, {status});
    res.json({ success: true, message: "Order Status updated" }); 
  }catch(error){
    console.log(error);
    res.json({ success: false,message:error.message}); 
  }
};


 const listOrdersPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const orders = await orderModel.find().sort({ date: -1 }).skip(skip).limit(limit);
    const totalOrders = await orderModel.countDocuments();

    res.json({
      success: true,
      orders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch paginated orders", error });
  }
};



const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await orderModel.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete order", error: error.message });
  }
};


export { placeOrder, placeOrderStripe, allOrder, userOrder, updateStatus, listOrdersPaginated , deleteOrder};
