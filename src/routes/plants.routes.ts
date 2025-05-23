import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { Roles } from '../middlewares/role.middleware';
import { UserRole } from '@prisma/client';
import { getPlants, getPlant, addPlant, editPlant, removePlant, uploadPlantImages, } from '../controllers/plantInfo.controllers';
  
const router = Router();

const uploadImage = uploadPlantImages.fields([
  { name: 'image', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 }])
//For Plant Info Routes
router.get('/get-plants',  authenticateToken, Roles(UserRole.CUSTOMER), getPlants as any);
router.get('/get-plants/:id',  authenticateToken, Roles(UserRole.CUSTOMER), getPlant as any);
router.post('/add-plant', uploadImage,  authenticateToken, Roles(UserRole.CUSTOMER), addPlant as any
);

router.put( '/edit-plant/:id', uploadPlantImages.fields([{ name: 'image', maxCount: 1 }, ]),  authenticateToken, Roles(UserRole.CUSTOMER), editPlant);
router.delete('/:id',  authenticateToken, Roles(UserRole.CUSTOMER), removePlant);

export default router;