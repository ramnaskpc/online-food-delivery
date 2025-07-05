import express from "express"

import{loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, addAddress,  getSavedAddresses} from "../controllers/userControllers.js"
import authUser from "../middleware/auth.js"

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)

userRouter.get('/profile', authUser, getUserProfile);
userRouter.put('/profile', authUser, updateUserProfile);

userRouter.get('/addresses', authUser, getSavedAddresses);
userRouter.post('/addresses', authUser, addAddress);

export default userRouter