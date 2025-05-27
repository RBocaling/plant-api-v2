import { Request, Response } from 'express';
import {
  submitFeedback,
  fetchAllFeedbacks,
  getFeedbackById,
  makeResponse,
  updateStatus,
  getUserFeedback,
} from '../services/feedback.services';
import { Status } from '@prisma/client';

export const createFeedback = async (req: Request, res: Response) => {
     console.log('BODY:', req.body);
  try {
    const userId = Number(req.user?.id);
    const { rating, description } = req.body;

    if (!userId || isNaN(userId)) {
      return res.status(401).json({ error: 'Unauthorized: Invalid user ID.' });
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }

    const feedback = await submitFeedback(rating, userId, description);

    return res.status(201).json({ message: 'Feedback submitted.', data: feedback });
  } catch (error: any) {
    console.error('Controller Error - createFeedback:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit feedback.' });
  }
};


export const respondToFeedback = async (req: Request, res: Response) => {
  try {
    const { id, response: reply } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid feedback ID.' });
    }

    if (!reply || typeof reply !== 'string') {
      return res.status(400).json({ error: 'Response message is required.' });
    }

    const updated = await makeResponse(Number(id), reply);

    return res.status(200).json({
      message: `Response added to feedback ID ${id}.`,
      data: updated,
    });
  } catch (error: any) {
    console.error('Controller Error - respondToFeedback:', error);
    return res.status(500).json({ error: error.message || 'Failed to respond to feedback.' });
  }
};

export const updateFeedbackStatus = async (req: Request, res: Response) => {
  try {
    const { id, status } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid feedback ID.' });
    }

    if (!status || typeof status !== 'string') {
      return res.status(400).json({ error: 'Status must be a string.' });
    }

    if (!Object.values(Status).includes(status as Status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${Object.values(Status).join(', ')}`,
      });
    }

    const updated = await updateStatus(Number(id), status as Status);

    return res.status(200).json({
      message: `Status updated for feedback ID ${id}.`,
      data: updated,
    });
  } catch (error: any) {
    console.error('Controller Error - updateFeedbackStatus:', error);
    return res.status(500).json({ error: error.message || 'Failed to update status.' });
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


export const getFeedbackForUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);

    if (!userId || isNaN(userId)) {
      return res.status(401).json({ error: 'Unauthorized: Invalid user ID.' });
    }

    const feedbacks = await getUserFeedback(userId);

    return res.status(200).json({ message: 'User feedback retrieved.', data: feedbacks });
  } catch (error: any) {
    console.error('Controller Error - getFeedbackForUser:', error);
    return res.status(500).json({ error: error.message || 'Failed to retrieve feedback.' });
  }
};
