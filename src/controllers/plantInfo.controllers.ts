import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  getAllPlantInfo,
  getPlantInfoById,
  createPlantInfo,
  updatePlantInfo,
  deletePlantInfo,
} from '../services/plantInfo.services';

import { deleteGalleryImage } from '../services/plantInfo.services';

import prisma from '../config/prisma'; 


const uploadDir = path.join(__dirname, '..', '..', 'assets', 'images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const uploadPlantImages = multer({ storage });

export const getPlants = async (_req: Request, res: Response) => {
    try {
      const plants = await getAllPlantInfo();
  
      if (!plants || plants.length === 0) {
        return res.status(404).json({ message: 'No plants found' });
      }
  
      res.status(200).json(plants);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
  

export const getPlant = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const plant = await getPlantInfoById(id);

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    res.status(200).json(plant);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addPlant = async (req: Request, res: Response) => {
  try {
    const { name, scientificName, genus, description, categoryId } = req.body;
    const files = req.files as {
      image?: Express.Multer.File[];
      galleryImages?: Express.Multer.File[];
    };

    if (!name || !scientificName || !genus || !description || !categoryId || !files?.image?.[0]) {
      return res.status(400).json({ message: 'All fields and main image are required' });
    }

    if (files.image.length > 1) {
        return res.status(400).json({ message: 'Only one main image is allowed' });
      }

    const mainImage = files.image[0].filename;

    const newPlant = await createPlantInfo({
      name,
      scientificName,
      genus,
      imageUrl: mainImage,
      description,
      categoryId: parseInt(categoryId),
    });

    if (files.galleryImages && files.galleryImages.length > 0) {
      const galleryData = files.galleryImages.map((file) => ({
        imageUrl: file.filename,
        plantId: newPlant.id,
      }));

      await prisma.plantGallery.createMany({ data: galleryData });
    }

    const fullPlant = await getPlantInfoById(newPlant.id);
    res.status(201).json(fullPlant);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const editPlant = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, scientificName, genus, description, categoryId } = req.body;
    const file = (req.files as any)?.image?.[0];

    const data: any = {
      name,
      scientificName,
      genus,
      description,
    };

    if (file) {
      data.imageUrl = file.filename;
    }

    if (categoryId) {
      data.categoryId = parseInt(categoryId);
    }

    const updated = await updatePlantInfo(id, data);
    const fullPlant = await getPlantInfoById(updated.id);

    res.status(200).json(fullPlant);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removePlant = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deletePlantInfo(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removeGalleryImage = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.imageId);
      await deleteGalleryImage(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };