import { prisma } from "../utils/index.js";

export class ResumeRepository {
  constructor() {
    this.prisma = prisma;
  }

  createResume = async (data) => {
    await this.prisma.resumes.create({
      data,
    });
  };

  selectAllSortedResumes = async (sort) => {
    const resume = await this.prisma.resumes.findMany({
      select: {
        resumeId: true,
        title: true,
        content: true,
        status: true,
        user: {
          select: {
            name: true,
          },
        },
        createdAt: true,
      },
      orderBy: [
        {
          [sort.orderKey]: sort.orderValue,
        },
      ],
    });
    return resume;
  };

  selectOneResumeByResumeId = async (resumeId) => {
    const resume = await this.prisma.resumes.findUnique({
      where: { resumeId: +resumeId },
      select: {
        resumeId: true,
        userId: true,
        title: true,
        content: true,
        user: {
          select: {
            name: true,
          },
        },
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return resume;
  };

  updateResumeByResumeId = async (resumeId, data) => {
    await this.prisma.resumes.update({
      where: { resumeId: +resumeId },
      data,
    });
  };

  deleteResumeByResumeId = async (resumeId) => {
    await this.prisma.resumes.delete({ where: { resumeId: +resumeId } });
    return;
  };
}
