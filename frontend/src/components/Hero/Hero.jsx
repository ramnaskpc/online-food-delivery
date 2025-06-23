import React from "react"
import hero_img from "../../assets/pizza2.png"
import "./Hero.css"

const Hero = ()=>{
    return (
        <div>
            <div className="hero">
                <div className="hero-top">
                    <div className="hero-left">
                  <h2>Enjoy Your Delicious Meal</h2>
                      <h1>Discover Healthy & Tasty Dishes That Nourish You</h1>
                       <p>Order your favorite food from top restaurants and enjoy fast delivery and unbeatable taste — all in one place.</p>
                 
                  </div>
                <div className="hero_right">
                    <img src ={hero_img} alt ="" className="hero_img"/>
                </div>
            </div>
         </div>
         </div>
        
    )
}

export default Hero