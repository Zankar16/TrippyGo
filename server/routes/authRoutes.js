import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  updateMe, 
  updateDna 
} from '../controllers/authController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.post('/register', register);
router.post('/login', login);

// Protected
router.get('/me', verifyToken, getMe);
router.put('/me', verifyToken, updateMe);
router.patch('/me/dna', verifyToken, updateDna);

export default router;
