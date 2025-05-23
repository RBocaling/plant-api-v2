import { Router } from 'express';
import {  getInfo, login,  refreshAccessToken, register } from '../controllers/auth.controllers';

const router = Router();

//For Login/Register Routes
router.post('/register', register as any);
router.post('/login', login);
router.post('/refresh-token', refreshAccessToken as any);
router.post('/get-info', getInfo as any);


export default router;
