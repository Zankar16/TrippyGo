import express from 'express';
import { 
  chat, 
  generateTrip, 
  refineTrip,
  extractIntent
} from '../controllers/aiController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/chat', chat);
router.post('/extract-intent', extractIntent);
router.post('/generate-trip', generateTrip);
router.post('/refine-trip', refineTrip);

export default router;
