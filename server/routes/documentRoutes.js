import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  uploadDocument, 
  getDocuments, 
  deleteDocument 
} from '../controllers/documentController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/documents');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.get('/', verifyToken, getDocuments);
router.post('/upload', verifyToken, upload.single('document'), uploadDocument);
router.delete('/:id', verifyToken, deleteDocument);

export default router;
