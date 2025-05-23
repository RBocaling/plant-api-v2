import { Request, Response } from 'express';
import { addPersonalInfo } from '../services/personal-info.services';

export const addPersonalInfoController = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id); 

  const { fname, lname, phone, gender, address, birthdate } = req.body;

  if (!fname || !lname || !phone || !gender || !address || !birthdate) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  

  try {
    const info = await addPersonalInfo(userId, {
      fname,
      lname,
      phone,
      gender,
      address,
      birthdate,
    });

    return res.status(201).json({ message: 'Personal info added', data: info });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
