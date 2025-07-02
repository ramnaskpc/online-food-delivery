
import express from "express";
import { adminLogin } from "../controllers/userControllers.js";
import adminAuth from "../middleware/adminAuth.js";
import { getAllUsers, updateUser, deleteUser } from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/users", adminAuth, getAllUsers);
router.put("/users/:id", adminAuth, updateUser);
router.delete("/users/:id", adminAuth, deleteUser);

export default router;
