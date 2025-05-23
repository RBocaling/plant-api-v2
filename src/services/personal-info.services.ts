import prisma from '../config/prisma';

export const addPersonalInfo = async (
  userId: number,
  {
    fname,
    lname,
    phone,
    gender,
    address,
    birthdate,
  }: {
    fname: string;
    lname: string;
    phone: string;
    gender: 'MALE' | 'FEMALE';
    address: string;
    birthdate: string;
  }
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { personalInfo: true },
  });

  if (!user) throw new Error('User not found');
  if (user.personalInfoId) throw new Error('Personal info already exists');

  const personalInfo = await prisma.personalInfo.create({
    data: {
      fname,
      lname,
      phone,
      gender,
      address,
      birthdate,
      user: { connect: { id: userId } },
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { personalInfoId: personalInfo.id },
  });

  return personalInfo;
};
