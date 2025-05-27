import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

export const submitFeedback = async (
  rating: number,
  userId: number
) => {
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  try {
    const feedback = await prisma.feedback.create({
      data: {
        rating,
        status: Status.OPEN,
        userId,
      },
    });

    return feedback;
  } catch (error) {
    console.error('Service Error - submitFeedback:', error);
    throw new Error('Error creating feedback');
  }
};

export const fetchAllFeedbacks = async () => {
  try {
    return await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Service Error - fetchAllFeedbacks:', error);
    throw new Error('Failed to retrieve feedbacks');
  }
};

export const getFeedbackById = async (id: number) => {
  try {
    return await prisma.feedback.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Service Error - getFeedbackById:', error);
    throw new Error('Failed to retrieve feedback by ID');
  }
};
