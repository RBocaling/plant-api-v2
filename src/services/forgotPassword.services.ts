import prisma from '../config/prisma';
import nodemailer from 'nodemailer';
import { randomInt } from 'crypto';
import argon2 from 'argon2';

const otpExpiryMinutes = 5;

export const sendOTP = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User with this email does not exist");

  const otp = randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + otpExpiryMinutes * 60000);

  await prisma.oTP.upsert({
    where: { email },
    update: { otp, expiresAt },
    create: { email, otp, expiresAt }
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from:`"Plant Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP is ${otp}. It expires in ${otpExpiryMinutes} minutes.`,
  });
};

export const verifyOTP = async (email: string, otp: string) => {
  const record = await prisma.oTP.findUnique({ where: { email } });

  if (!record || record.otp !== otp || record.expiresAt < new Date()) {
    throw new Error("Invalid or expired OTP");
  }

  return true;
};

export const resetPassword = async (email: string, newPassword: string) => {
  const hashedPassword = await argon2.hash(newPassword);
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword }
  });

  await prisma.oTP.delete({ where: { email } });
};
