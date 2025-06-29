import React, { useContext, useEffect, useState } from 'react'
import { FoodContext } from '../../context/FoodContext'
import {MdDelete} from "react-icons/md"
import CartTotal from "../../components/CartTotal/CartTotal"
import "./Cart.css"
import { useNavigate } from 'react-router-dom'

const Cart = () => {

   const navigate = useNavigate();

const {products, currency, cartItems, updateQuantity} = useContext(FoodContext)

const [cartData, setCartData] = useState([])

useEffect(() => {
  if (products.length === 0) return;

  if (!cartItems || typeof cartItems !== "object") {
    setCartData([]);
    return;
  }

  const tempData = Object.entries(cartItems)
    .filter(([, quantity]) => quantity > 0)
    .map(([itemId, quantity]) => ({
      _id: itemId,
      quantity
    }));

  setCartData(tempData);
}, [cartItems, products]);

  return (
    <div>
     <div>
      <h2>Cart Items</h2>
     </div>
     <div className='cart-content-container'>
       {
        cartData.map((item,index)=>{
          const productData = products.find(product =>product._id === item._id)
          if(!productData){
            return null
          }
          return (
            <div className='cart-item' key={index}>
             <div>

              <img src ={productData.image} alt='' className='product-cart-image'/>
              <div className='product-details-cart'>
                <p className='cart-product-name'>{productData.name}</p>
                <p className='cart-product-price'>{currency}{productData.price}</p>
                </div>
              </div>

              <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    className='quantity-input'
                    onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value > 0) updateQuantity(item._id, value);
                   }}
             />

         <MdDelete className = "delete-icon" onClick={()=>updateQuantity(item._id, 0)}/>
           
        </div>
          )

        })
       }
     </div>
     <div className='checkout-container'></div>
     <div className="checkout-box">
      <CartTotal/>
      <div className="checkout-btn-container">
        <button onClick={()=>navigate("/checkout")}className='checkout-btn'>PROCEED TO CHECKOUT</button>
      </div>
     </div>
    </div>
  )
}

export default Cart
