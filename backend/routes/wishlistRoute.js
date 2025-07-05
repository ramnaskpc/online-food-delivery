
import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import authUser from '../middleware/auth.js';

const router = express.Router();

router.get('/', authUser, getWishlist);
router.post('/add', authUser, addToWishlist);
router.delete('/remove', authUser, removeFromWishlist);

export default router;
