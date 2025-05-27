import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { UserRole } from "@prisma/client";
import { Roles } from "../middlewares/role.middleware";
import { contactUsController } from "../controllers/contact_us.controllers";

const router = Router();

router.post('/create-contact-us', authenticateToken, Roles(UserRole.CUSTOMER),  contactUsController as any);


export default router;