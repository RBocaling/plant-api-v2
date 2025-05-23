import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { UserRole } from "@prisma/client";
import { Roles } from "../middlewares/role.middleware";
import { createChat, getChat } from "../controllers/chat.controllers";

const router = Router();

router.post('/create-chat', authenticateToken, Roles(UserRole.CUSTOMER),  createChat as any);
router.get('/get-chats', authenticateToken, Roles(UserRole.CUSTOMER),  getChat as any);

export default router;