import { Request, Response } from 'express';
import * as chatService from '../services/chat.services';

export const createChat = async (req: Request, res: Response): Promise<void> => {
  const {  request } = req.body;
   const gptResponse = "gpt response";

   const senderId = Number(req.user?.id)
    
  if (!senderId) {
    res.status(400).json({ error: 'Missing senderId or receiverId' });
    return;
  }

  try {
    const chat = await chatService.sendMessage(senderId, request, gptResponse);
    res.status(201).json(chat);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getChat = async (req: Request, res: Response): Promise<void> => {
    const senderId = Number(req.user?.id)
  
    if (!senderId) {
      res.status(400).json({ error: 'Missing senderId' });
      return;
    }
    try {
      const chats = await chatService.getMessages(senderId);

      if (!chats || chats.length === 0) {
        res.status(404).json({ error: 'Chats not found' });
        return;
      }
  
      res.status(200).json({ data: chats });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
};
