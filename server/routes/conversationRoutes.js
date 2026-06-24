import express from 'express';
import { 
  getConversations, 
  createConversation, 
  getMessages, 
  deleteConversation 
} from '../controllers/conversationController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getConversations);
router.post('/', verifyToken, createConversation);
router.get('/:id/messages', verifyToken, getMessages);
router.delete('/:id', verifyToken, deleteConversation);

export default router;
