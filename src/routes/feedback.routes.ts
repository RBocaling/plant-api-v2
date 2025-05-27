import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { UserRole } from "@prisma/client";
import { Roles } from "../middlewares/role.middleware";
import { createFeedback, getAllFeedbacks } from "../controllers/feedback.controllers";

const router = Router();

router.post('/create-feedback', authenticateToken, Roles(UserRole.CUSTOMER),  createFeedback as any);
router.get('/get-feedback', authenticateToken, Roles(UserRole.ADMIN),  getAllFeedbacks as any);


export default router;