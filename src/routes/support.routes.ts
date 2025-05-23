import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { UserRole } from "@prisma/client";
import { Roles } from "../middlewares/role.middleware";
import { createSupportConcern } from "../controllers/support_chat.controllers";

const router = Router();

router.post('/create-concern', authenticateToken, Roles(UserRole.CUSTOMER),  createSupportConcern as any);


export default router;