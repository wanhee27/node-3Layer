import { ResumeService } from "../services/resumes.service.js";

export class ResumeController {
  constructor() {
    this.resumeService = new ResumeService();
  }

  createResume = async (req, res, next) => {
    try {
      const { title, content } = req.body;
      const { userId } = req.user;
      if (!title) {
        return res.status(404).json({ success: false, message: "제목을 입력해주세요." });
      }
      if (!content) {
        return res.status(404).json({ success: false, message: "내용을 입력해주세요" });
      }
      await this.resumeService.createResume({ userId: +userId, title, content });

      return res.status(201).json({ message: "이력서가 등록되었습니다." });
    } catch (err) {
      next(err);
    }
  };

  findAllResume = async (req, res, next) => {
    try {
      const orderKey = req.query.orderKey ?? "resumeId";
      const orderValue = req.query.orderValue ?? "desc";
      if (!["resumeId", "status"].includes(orderKey)) {
        return res.status(400).json({ success: false, message: "orderKey가 올바르지 않습니다." });
      }
      if (!["asc", "desc"].includes(orderValue.toLowerCase())) {
        return res.status(400).json({ success: false, message: "orderValue가 올바르지 않습니다." });
      }

      const resume = await this.resumeService.findAllSortedResumes({
        orderKey,
        orderValue: orderValue.toLowerCase(),
      });

      return res.status(200).json({ data: resume });
    } catch (err) {
      next(err);
    }
  };

  findOneResume = async (req, res, next) => {
    try {
      const { resumeId } = req.params;
      if (!resumeId) {
        return res.status(400).json({ success: false, message: "resumeI는 필수값입니다." });
      }
      const resume = await this.resumeService.findOneResumeByResumeId(resumeId);

      if (!resume) {
        return res.status(200).json({ success: false, message: "이력서가 존재하지 않습니다." });
      }
      return res.status(200).json({ data: resume });
    } catch (err) {
      next(err);
    }
  };

  updateResume = async (req, res, next) => {
    try {
      const { resumeId } = req.params;
      const { title, content, status } = req.body;

      if (!resumeId) {
        return res.status(400).json({ success: false, message: "resumeId는 필수값입니다." });
      }
      if (!title) {
        return res.status(400).json({ success: false, message: "이력서 제목을 입력해주세요." });
      }
      if (!content) {
        return res.status(400).json({ success: false, message: "이력서를 작성해주세요." });
      }
      if (!status) {
        return res.status(400).json({ success: false, message: "상태값은 필수입니다." });
      }
      if (!["APPLY", "DROP", "PASS", "INTERVIEW1", "INTERVIEW2", "FINAL_PASS"].includes(status)) {
        return res.status(400).json({ success: false, message: "올바르지 않은 상태값 입니다." });
      }
      await this.resumeService.updateResumeByResumeId(resumeId, {
        title,
        content,
        status,
      });

      return res.status(200).json({ message: "이력서 수정사항이 저장되었습니다." });
    } catch (err) {
      next(err);
    }
  };

  deleteResume = async (req, res, next) => {
    try {
      const { resumeId } = req.params;
      const { userId } = req.user;

      if (!resumeId) {
        return res.status(400).json({ success: false, message: "resumeId는 필수값입니다." });
      }

      await this.resumeService.deleteResume(resumeId, userId);

      return res.status(200).json({ message: "이력서가 삭제되었습니다." });
    } catch (err) {
      next(err);
    }
  };
}
