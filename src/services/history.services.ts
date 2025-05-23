import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createHistory = async (
  userId: number,
  plant_id: string,
  plant_name: string
) => {
  try {
    return await prisma.history.create({
      data: {
        plant_id,
        plant_name,
        user: {
          connect: { id: userId },
        },
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to create history: ${error.message}`);
    } else {
      throw new Error('Failed to create history due to an unknown error.');
    }
  }
};

export const getHistoryByUser = async (userId: number) => {
  return await prisma.history.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};
