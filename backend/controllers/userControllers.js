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



const registerUser = async (req, res)=>{
   
    try{
        
        const {name, email, password} = req.body;

        const exists = await userModel.findOne({email});
        if(exists){
            return res.status(400).json({message:"User already exist"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({success:false, message:"Invalid email address"})
        }

        if(password.length <8){
            return res.status(400).json({success:false, message:"please enter strong password"})
        }


        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,email,password:hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)
        res.json({success:true, message:"Account created succsessfully", token})

    }catch(error){
         console.log(error)
         res.json({succes:false, message:error.message})
    }
}

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


export {loginUser, registerUser, adminLogin}