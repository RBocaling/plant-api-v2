import { Request, Response } from 'express';
import { createHistory, getHistoryByUser } from '../services/history.services';
import { logActivity } from '../utils/logs';

export const createHistoryController = async (req: Request, res: Response) => {
  try {
    const { plant_id, plant_name, img_url } = req.body;
    const userId = Number(req.user?.id);

    if (!plant_id || !plant_name) {
      return res.status(400).json({ error: 'plant_id and plant_name are required.' });
    }

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid or missing user ID from request.' });
    }

    const history = await createHistory(userId, plant_id, plant_name, img_url);

    await logActivity({userId, activity: `Created history entry for plant: ${plant_name}`,});

    return res.status(201).json({
      message: 'History entry created successfully.',
      data: history,
    });
  } catch (error) {
    console.error('Create History Controller Error:', error);
    return res.status(500).json({ error: 'Failed to create history.' });
  }
};

export const getHistoryByUserController = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid or missing user ID from request.' });
    }

    const histories = await getHistoryByUser(userId);

    await logActivity({userId, activity: 'Viewed their plant history'});

    return res.status(200).json({
      message: 'User history fetched successfully.',
      data: histories,
    });
  } catch (error) {
    console.error('Get History Controller Error:', error);
    return res.status(500).json({ error: 'Failed to fetch user history.' });
  }
};
