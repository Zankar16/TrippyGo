import { prisma } from '../index.js';
import fs from 'fs';

export const getDocuments = async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      where: { userId: req.userId },
      orderBy: { uploadedAt: 'desc' }
    });
    res.status(200).json(documents);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const document = await prisma.document.create({
      data: {
        userId: req.userId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        filePath: `/uploads/documents/${req.file.filename}`
      }
    });

    res.status(201).json(document);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload document' });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await prisma.document.findUnique({ where: { id, userId: req.userId } });
    
    if (!document) return res.status(404).json({ error: 'Document not found' });

    // Remove from FS
    const fullPath = `./${document.filePath}`;
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await prisma.document.delete({ where: { id } });
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
};
