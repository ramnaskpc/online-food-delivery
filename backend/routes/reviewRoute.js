import express from 'express';
import { addReview, getReviews, deleteReview } from '../controllers/reviewController.js';
import authUser from '../middleware/auth.js';

const router = express.Router();

router.post('/review/:productId', authUser, addReview);
router.get('/review/:productId', getReviews);
router.delete('/review/:id', authUser, deleteReview);

export default router;

