import express from 'express';
import { 
  getPopularDestinations, 
  getDestinationDetail, 
  getRecommendations 
} from '../controllers/exploreController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getPopularDestinations);
router.get('/:id', verifyToken, getDestinationDetail);
router.get('/:destination/recommendations', verifyToken, getRecommendations);

export default router;
