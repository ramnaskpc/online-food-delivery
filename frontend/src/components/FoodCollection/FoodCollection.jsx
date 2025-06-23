import React, { useState } from 'react'
import {categoryItem} from "../../assets/assets"
import { useContext } from 'react'
import { FoodContext } from '../../context/FoodContext'
import "./FoodCollection.css";

import { backendUrl } from '../../App'; 

const FoodCollection = () => {

    const {products, addToCart,getProductData} = useContext(FoodContext)

   const [category, setCategory] = useState("All")



  return (
    <div>
      <div className="food_container">
      <div className="header_section">
       <h1>Discover Our Menu</h1>
       <hr className='divider'/>
       </div>

      <div className="display_container">
   <div className="category_section">
    <h1>Explore our categories</h1>
    <ul className="category_list">
      {
        categoryItem.map((item, index)=>(
            <li key={index}
               onClick={()=>setCategory((prev)=>(prev ===item.category_title ? "All":item.category_title))}
               className={category===item.category_title ? "active":""}
            >
                {item.category_title}
            </li>
        ))
      }

    </ul>
    </div>

<div className="grid_display">
    {
        products.length>0?(
    products.filter((product)=> category === "All" || category === product.category).map((product)=>(

                <div key={product._id} className='product_card'>
                    <div className="product_image">
                        <img src={product.image} alt=''/>
                    
                    </div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="price_add">
                        <p>${product.price}</p>
                        <button onClick={()=>addToCart(product._id)}>Add To Cart</button>
                    </div>

                </div>
            ))
        ):(
            <p> no products is available</p>
        )
    }
</div>
      </div>
      </div>
    </div>
    
  )
}

export default FoodCollection
