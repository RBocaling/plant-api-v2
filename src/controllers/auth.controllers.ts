import { Request, Response } from "express";
import prisma from '../config/prisma';
import {
  registerUser,
  loginUser,
  // uploadDocuments,
  userInfo,
  changePassword,
  editUser,
  getAllCustomerUsers,
  archiveUser,
} from "../services/auth.services";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token";
import { UserRole } from "@prisma/client";

export const register = async (req: Request, res: Response) => {
  const { email, password, confirmPassword, role, username, firstName,lastName, profile } = req.body;
  console.log("{ email, password, role, username, profile }", {
    email,
    password,
    confirmPassword,
    role,
    username,
    firstName,
    lastName,
    profile
  });

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    return res.status(400).json({ message: "Email is already in use" });
  }
  
   if (existingUsername) {
    return res.status(400).json({ message: "Username is already in use" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const passwordErrors = [];
  if (password.length < 8) {
    passwordErrors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    passwordErrors.push("Password must include an uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    passwordErrors.push("Password must include a lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    passwordErrors.push("Password must include a number");
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    passwordErrors.push("Password must include a special character");
  }

  if (passwordErrors.length > 0) {
    return res.status(400).json({ message: passwordErrors });
  }
  
  if (!email || !password || !confirmPassword || !role || !username) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await registerUser(email, password, role, username,firstName,lastName, profile);
    res.status(201).json({ message: "User registered", userId: user.id });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { identifier, password } = req.body;
  
  try {
    const { accessToken, refreshToken } = await loginUser(identifier, password);

    res.status(201).json({
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(decoded.id, decoded.role);
    const newRefreshToken = generateRefreshToken(decoded.id);

    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const getInfo = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await userInfo(userId);
    return res.status(200).json(user);
  } catch (error: any) {
    console.error('Controller Error - getInfo:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch user info' });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id); 
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const response = await changePassword(userId, currentPassword, newPassword, confirmNewPassword);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const updateUser = async (req: Request, res: Response) => {
  const { id, email, username, firstName, lastName, profile } = req.body;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: 'A valid user ID is required' });
  }

  // const user = await prisma.user.findUnique({ where: { id: Number(id) } });

  // if (!user) {
  //   return res.status(404).json({ message: `User with ID ${id} not found` });
  // }

  // if (user.role !== UserRole.CUSTOMER) {
  //   return res.status(403).json({ message: 'Only users with role CUSTOMER can be edited' });
  // }
  try {
    const updated = await editUser(Number(id), {
      email,
      username,
      firstName,
      lastName,
      profile,
    });

    return res.status(200).json({ message: 'User updated successfully', data: updated });
  } catch (error: any) {
    console.error('Controller Error - updateUser:', error);
    return res.status(500).json({ error: error.message || 'Failed to update user' });
  }
};


export const removeUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const result = await archiveUser(userId);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};



export const fetchAllCustomerUsers = async (req: Request, res: Response) => {
  try {
    const customers = await getAllCustomerUsers();
    return res.status(200).json({ message: 'All customer users retrieved successfully', data: customers });
  } catch (error: any) {
    console.error('Controller Error - fetchAllCustomerUsers:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch customer users' });
  }
};


