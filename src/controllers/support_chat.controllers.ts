import { Request, Response } from 'express';
import { fetchAllSupportConcerns, getSupportConcernByIdAdmin, submitSupportConcern } from '../services/support_chat.services';


export const createSupportConcern = async (req: Request, res: Response) => {
  try {
    const { concern_msg, image } = req.body;
    const customer_id = Number(req.user?.id); 

    if (!concern_msg || !image) {
      return res.status(400).json({ error: 'concern_msg and image are required.' });
    }

    const support = await submitSupportConcern({ concern_msg, image, customer_id });

    return res.status(201).json({ message: 'Support concern submitted.', data: support });
  } catch (error) {
    console.error('Controller Error:', error);
    return res.status(500).json({ error: 'Failed to submit concern.' });
  }
};


export const getAllSupportConcerns = async (req: Request, res: Response) => {
  try {
    const concerns = await fetchAllSupportConcerns();
    return res.status(200).json({ message: 'All support concerns retrieved.', data: concerns });
  } catch (error) {
    console.error('Controller Error:', error);
    return res.status(500).json({ error: 'Failed to fetch support concerns.' });
  }
};


export const getSupportConcernById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const concern = await getSupportConcernByIdAdmin(id);

    if (!concern) {
      return res.status(404).json({ error: 'Support concern not found.' });
    }

    return res.status(200).json({ message: 'Support concern retrieved.', data: concern });
  } catch (error) {
    console.error('Controller Error:', error);
    return res.status(500).json({ error: 'Failed to fetch support concern.' });
  }
};