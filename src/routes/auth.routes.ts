import { Router } from 'express';
import {  login,  refreshAccessToken, register } from '../controllers/auth.controllers';

const router = Router();

//For Login/Register Routes
router.post('/register', register as any);
router.post('/login', login);
router.post('/refresh-token', refreshAccessToken as any);


export default router;
