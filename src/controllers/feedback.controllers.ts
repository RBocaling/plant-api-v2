import { Request, Response } from 'express';
import {
  submitFeedback,
  fetchAllFeedbacks,
  getFeedbackById,
} from '../services/feedback.services';

export const createFeedback = async (req: Request, res: Response) => {
     console.log('BODY:', req.body);
  try {
    const userId = Number(req.user?.id);
    const { rating } = req.body;

    if (!userId || isNaN(userId)) {
      return res.status(401).json({ error: 'Unauthorized: Invalid user ID.' });
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }

    const feedback = await submitFeedback(rating, userId);

    return res.status(201).json({ message: 'Feedback submitted.', data: feedback });
  } catch (error: any) {
    console.error('Controller Error - createFeedback:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit feedback.' });
  }
};



export const getAllFeedbacks = async (_req: Request, res: Response) => {
  try {
    const feedbacks = await fetchAllFeedbacks();
    return res.status(200).json({ message: 'All feedbacks retrieved.', data: feedbacks });
  } catch (error) {
    console.error('Controller Error - getAllFeedbacks:', error);
    return res.status(500).json({ error: 'Failed to fetch feedbacks.' });
  }
};

export const getFeedbackByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid feedback ID.' });
    }

    const feedback = await getFeedbackById(id);

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found.' });
    }

    return res.status(200).json({ message: 'Feedback retrieved.', data: feedback });
  } catch (error) {
    console.error('Controller Error - getFeedbackByIdController:', error);
    return res.status(500).json({ error: 'Failed to fetch feedback.' });
  }
};
