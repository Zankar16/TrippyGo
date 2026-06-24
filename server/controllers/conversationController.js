import { prisma } from '../index.js';

export const getConversations = async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId: req.userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
    
    // Map to include lastMessage for the sidebar
    const formatted = conversations.map(c => ({
      id: c.id,
      title: c.title,
      thumbnail: c.thumbnail,
      lastMessage: c.messages[0]?.content || '',
      updatedAt: c.updatedAt
    }));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

export const createConversation = async (req, res) => {
  try {
    const { title } = req.body;
    const conversation = await prisma.conversation.create({
      data: {
        userId: req.userId,
        title: title || 'New Conversation'
      }
    });
    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create conversation' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: 'asc' }
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.conversation.delete({ where: { id, userId: req.userId } });
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
};
