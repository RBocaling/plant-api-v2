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
