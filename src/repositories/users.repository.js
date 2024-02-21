import { prisma } from "../utils/index.js";

export class UserRepository {
  findById = async (userId) => {
    return prisma.users.findFirst({
      where: { userId: +userId },
      select: {
        userId: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  };

  updateUserInfo = async (userId, name, password) => {
    const updateData = {};
    if (name) updateData.name = name;
    if (password) updateData.password = password;

    return prisma.users.update({
      where: { userId: +userId },
      data: updateData,
    });
  };

  findOtherUserInfo = async (userId) => {
    const user = await this.findById(userId);
    if (!user) return null;

    const userProfile = await prisma.users.findFirst({
      where: { userId: +userId },
      select: {
        userId: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const userResume = await prisma.resumes.findMany({
      where: { userId: +userId },
      select: {
        postId: true,
        userId: true,
        name: true,
        title: true,
        content: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return { userProfile, userResume };
  };

  deleteUserData = async (userId) => {
    return prisma.users.delete({
      where: { userId: +userId },
    });
  };
}
