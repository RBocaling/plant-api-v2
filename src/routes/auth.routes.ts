import { Router } from 'express';
import {  getInfo, login,  refreshAccessToken, register, updatePassword, updateUser, fetchAllCustomerUsers, removeUser} from '../controllers/auth.controllers';
import { authenticateToken } from '../middlewares/auth.middleware';
import { Roles } from '../middlewares/role.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

//For Login/Register Routes
router.post('/register', register as any);
router.post('/login', login);
router.post('/refresh-token', refreshAccessToken as any);
router.get('/get-info', authenticateToken, getInfo as any);
router.get('/get-users-list', authenticateToken, fetchAllCustomerUsers as any);
router.post('/change-password', authenticateToken, Roles(UserRole.CUSTOMER),  updatePassword as any);
router.post('/edit-user', authenticateToken, Roles(UserRole.ADMIN), updateUser as any);
router.post('/delete-user/:id', authenticateToken, Roles(UserRole.ADMIN), removeUser as any);

export default router;
