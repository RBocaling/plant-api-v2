import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { UserRole } from "@prisma/client";
import { Roles } from "../middlewares/role.middleware";
import { createHistoryController,getHistoryByUserController } from "../controllers/history.controllers";

const router = Router();

router.post('/create-history', authenticateToken, Roles(UserRole.CUSTOMER),  createHistoryController as any);
router.get('/get-history', authenticateToken,  getHistoryByUserController as any);

export default router;