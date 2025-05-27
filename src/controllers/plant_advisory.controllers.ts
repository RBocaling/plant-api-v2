import { Request, Response } from 'express';
import {
  submitPlantAdvisory,
  fetchAllPlantAdvisories,
  getPlantAdvisoryById,
  updatePlantAdvisoryStatus,
  updatePlantAdvisoryPriority,
} from '../services/plant_advisory.services';
import { Type, Status } from '@prisma/client';

export const createPlantAdvisory = async (req: Request, res: Response) => {
  try {
    const customer_id = Number(req.user?.id);
    const { plant_name, request_type, status, priority } = req.body;

    console.log("req.body",req.body);
    
    if (!customer_id || isNaN(customer_id)) {
      return res.status(401).json({ error: 'Unauthorized: Invalid customer ID.' });
    }

    if (!plant_name || !request_type || !status || !priority) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // if (!Object.values(Type).includes(request_type)) {
    //   return res.status(400).json({ error: 'Invalid request_type value' });
    // }

    // if (!Object.values(Status).includes(status) || !Object.values(Status).includes(priority)) {
    //   return res.status(400).json({ error: 'Invalid status or priority value' });
    // }

    const advisory = await submitPlantAdvisory(
      plant_name,
      request_type,
      status,
      priority,
      customer_id
    );

    return res.status(201).json({ message: 'Plant advisory submitted.', data: advisory });
  } catch (error) {
    console.error('Controller Error - createPlantAdvisory:', error);
    return res.status(500).json({ error: 'Failed to submit plant advisory.' });
  }
};

export const getAllPlantAdvisories = async (_req: Request, res: Response) => {
  try {
    const advisories = await fetchAllPlantAdvisories();
    return res.status(200).json({ message: 'All plant advisories retrieved.', data: advisories });
  } catch (error) {
    console.error('Controller Error - getAllPlantAdvisories:', error);
    return res.status(500).json({ error: 'Failed to fetch plant advisories.' });
  }
};

export const getPlantAdvisoryByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid advisory ID.' });
    }

    const advisory = await getPlantAdvisoryById(id);

    if (!advisory) {
      return res.status(404).json({ error: 'Plant advisory not found.' });
    }

    return res.status(200).json({ message: 'Plant advisory retrieved.', data: advisory });
  } catch (error) {
    console.error('Controller Error - getPlantAdvisoryByIdController:', error);
    return res.status(500).json({ error: 'Failed to fetch plant advisory.' });
  }
};

export const updateAdvisoryStatus = async (req: Request, res: Response) => {
  try {
    const { id, status } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid advisory ID.' });
    }

    if (!Object.values(Status).includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const updated = await updatePlantAdvisoryStatus(Number(id), status);

    return res.status(200).json({
      message: `Status updated for advisory ID ${id}.`,
      data: updated,
    });
  } catch (error: any) {
    console.error('Controller Error - updateAdvisoryStatus:', error);
    return res.status(500).json({ error: error.message || 'Failed to update status.' });
  }
};

export const updateAdvisoryPriority = async (req: Request, res: Response) => {
  try {
    const { id, priority } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid advisory ID.' });
    }

    if (!Object.values(Status).includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority value.' });
    }

    const updated = await updatePlantAdvisoryPriority(Number(id), priority);

    return res.status(200).json({
      message: `Priority updated for advisory ID ${id}.`,
      data: updated,
    });
  } catch (error: any) {
    console.error('Controller Error - updateAdvisoryPriority:', error);
    return res.status(500).json({ error: error.message || 'Failed to update priority.' });
  }
};
