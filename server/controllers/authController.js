import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email, creatorMode: user.creatorMode, travelDna: user.travelDna } 
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email, creatorMode: user.creatorMode, travelDna: user.travelDna } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.status(200).json({ 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      creatorMode: user.creatorMode, 
      travelDna: user.travelDna 
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateMe = async (req, res) => {
  try {
    const { name, creatorMode } = req.body;
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { name, creatorMode },
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateDna = async (req, res) => {
  try {
    const { travelDna } = req.body;
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { travelDna },
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
