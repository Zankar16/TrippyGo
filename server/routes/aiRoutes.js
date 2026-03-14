import express from 'express';
import { 
  chat, 
  generateTrip, 
  refineTrip 
} from '../controllers/aiController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/chat', verifyToken, chat);
router.post('/generate', verifyToken, generateTrip);
router.post('/refine', verifyToken, refineTrip);

export default router;
