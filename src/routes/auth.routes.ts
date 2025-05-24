import { Router } from 'express';
import {  getInfo, login,  refreshAccessToken, register, updatePassword } from '../controllers/auth.controllers';
import { authenticateToken } from '../middlewares/auth.middleware';
import { Roles } from '../middlewares/role.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

//For Login/Register Routes
router.post('/register', register as any);
router.post('/login', login);
router.post('/refresh-token', refreshAccessToken as any);
router.get('/get-info', authenticateToken, getInfo as any);
router.post('/change-password', authenticateToken, Roles(UserRole.CUSTOMER),  updatePassword as any);


export default router;
