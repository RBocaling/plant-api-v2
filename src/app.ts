import express from 'express';
import dotenv from 'dotenv';
import { json } from 'body-parser';
import authRoutes from './routes/auth.routes';
import otp from './routes/otp.routes';
import supportRouter  from './routes/support.routes';
import notif  from './routes/notification.routes';
import historyRoutes  from './routes/history.routes';
import userRoute  from './routes/user.routes';
import contactUs  from './routes/contact_us.routes';
import plantAdvisory  from './routes/plant_advisory.routes';
import userFeedback  from './routes/feedback.routes';
import activityLogs  from './routes/activity_logs.routes';

import cors from 'cors';
import path from 'path';

dotenv.config();

const app = express();

app.use(json());
app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use('/images', express.static(path.join(__dirname, '..', 'assets', 'images')));
    
app.use('/api/auth', authRoutes);
app.use('/api/forgot-password/', otp);
app.use('/api/supports/', supportRouter);
app.use('/api/notification/', notif);
app.use('/api/history/', historyRoutes);
app.use('/api/users/', userRoute);
app.use('/api/contact-us/', contactUs);
app.use('/api/plant-advisory/', plantAdvisory);
app.use('/api/feedback/', userFeedback);
app.use('/api/logs/', activityLogs);

export default app;
