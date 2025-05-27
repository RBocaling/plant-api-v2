import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SupportInput {
  concern_msg: string;
  image: string;
  customer_id: number;
}

export const submitSupportConcern = async ({ concern_msg, image, customer_id }: SupportInput) => {
  try {
    const support = await prisma.support.create({
      data: {
        concern_msg,
        image,
        customer_id,
      },
    });

    return support;
  } catch (error) {
    console.error('Service Error:', error);
    throw new Error('Error creating support entry');
  }
};

export const fetchAllSupportConcerns  = async () => {
  try {
    return await prisma.support.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Service Error - fetchAllSupportConcerns :', error);
    throw new Error('Failed to retrieve all support concerns');
  }
};

export const getSupportConcernByIdAdmin = async (id: number) => {
  try {
    return await prisma.support.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Service Error - getSupportConcernByIdAdmin:', error);
    throw new Error('Failed to retrieve support concern by ID');
  }
};
