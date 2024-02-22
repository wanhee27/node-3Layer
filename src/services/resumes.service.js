import { ResumeRepository } from "../repositories/resumes.repository.js";

export class ResumeService {
  constructor() {
    this.resumeRepository = new ResumeRepository();
  }

  createResume = async ({ userId, title, content }) => {
    await this.resumeRepository.createResume({
      userId,
      title,
      content,
      status: "APPLY",
    });
  };

  findAllSortedResumes = async (sort) => {
    const resume = await this.resumeRepository.selectAllSortedResumes(sort);
    return resume;
  };

  findOneResumeByResumeId = async (resumeId) => {
    const resume = await this.resumeRepository.selectOneResumeByResumeId(resumeId);
    return resume;
  };

  updateResumeByResumeId = async (resumeId, title, content, status, grade) => {
    const resume = await this.resumeRepository.selectOneResumeByResumeId(resumeId);

    if (!resume) {
      throw {
        code: 400,
        message: "이력서 조회에 실패하였습니다.",
      };
    }
    if (grade === "USER" && userId !== resume.userId) {
      throw {
        code: 400,
        message: "이력서를 수정할 권한이 없습니다.",
      };
    }
    if (!resume) {
      throw {
        code: 401,
        message: "존재하지 않는 이력서 입니다.",
      };
    }
    await this.resumeRepository.updateResumeByResumeId(resumeId, title, content, status);
  };

  deleteResume = async (resumeId) => {
    const resume = await this.resumeRepository.selectOneResumeByResumeId(resumeId);

    if (!resume) {
      throw {
        code: 400,
        message: "존재하지 않는 이력서 입니다.",
      };
    }

    if (resume.userId !== resume.userId) {
      throw {
        code: 400,
        message: "올바르지 않은 요청입니다.",
      };
    }

    await this.resumeRepository.deleteResumeByResumeId(resumeId);
  };
}
