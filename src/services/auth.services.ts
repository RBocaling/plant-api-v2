import argon2 from 'argon2';
import prisma from '../config/prisma';
import { generateAccessToken, generateRefreshToken } from '../utils/token';

export const registerUser = async (email: string, password: string, role: "CUSTOMER" | "ADMIN", username:string, firstName:string,
    lastName:string) => {
  const hashedPassword = await argon2.hash(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
      username,
      firstName,
      lastName
    },
  });

  return user;
};

export const loginUser = async (identifier: string, password: string)  => {

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { username: identifier }
      ]
    }
  });
  
  
   let isPasswordValid = false;

  if (user) {
    isPasswordValid = await argon2.verify(user.password, password);
  }

  if (!user && !isPasswordValid) {
    throw new Error('Invalid email or username and password!');
  }

  if (!user) {
    throw new Error('Incorrect email or username!');
  }

  if (!isPasswordValid) {
    throw new Error('Incorrect password!');
  }
 
  return {
    accessToken: generateAccessToken(user.id, user.role),
    refreshToken: generateRefreshToken(user.id)
  };
};

export const userInfo = async (id:number)  => {
  try {
    
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        email:true,
        username:true,
        role:true,
       // profileUrl:true
      }
    });
  
    return user;
  } catch (error) {
    
  }
};


export const changePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await argon2.verify(user.password, currentPassword);
  if (!isPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  if (newPassword !== confirmNewPassword) {
    throw new Error("New password and confirm password do not match");
  }

  const newHashedPassword = await argon2.hash(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: newHashedPassword },
  });

  return { message: "Password changed successfully" };
};
