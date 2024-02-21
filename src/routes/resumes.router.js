import express from "express";
import { prisma } from "../utils/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 이력서 생성
router.post("/resumes", authMiddleware, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const { userId } = req.user;

    if (!title) {
      return res.status(404).json({ success: false, message: "제목을 입력해주세요." });
    }
    if (!content) {
      return res.status(404).json({ success: false, message: "내용을 입력해주세요" });
    }
    const resume = await prisma.resumes.create({
      data: {
        userId: +userId,
        title,
        content,
        status: "APPLY",
      },
    });
    return res.status(201).json({ data: resume, message: "이력서가 등록되었습니다." });
  } catch (error) {
    next(error);
  }
});

// 모든 이력서 목록 조회
router.get("/resumes", async (req, res, next) => {
  try {
    const orderKey = req.query.orderKey ?? "resumeId";
    const orderValue = req.query.orderValue ?? "desc";

    if (!["resumeId", "status"].includes(orderKey)) {
      return res.status(400).json({ success: false, message: "orderKey가 올바르지 않습니다." });
    }
    if (!["asc", "desc"].includes(orderValue.toLowerCase())) {
      return res.status(400).json({ success: false, message: "orderValue가 올바르지 않습니다." });
    }

    const resume = await prisma.resumes.findMany({
      select: {
        resumeId: true,
        userId: true,
        title: true,
        content: true,
        user: { select: { name: true } },
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        {
          [orderKey]: orderValue,
        },
      ],
    });

    return res.status(200).json({ data: resume });
  } catch (error) {
    next(error);
  }
});

// 이력서 상세 조회
router.get("/resumes/:resumeId", async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    if (!resumeId) {
      return res.status(400).json({ success: false, message: "resumeI는 필수값입니다." });
    }
    const resume = await prisma.resumes.findFirst({
      where: { resumeId: +resumeId },
      select: {
        resumeId: true,
        userId: true,
        title: true,
        content: true,
        user: { select: { name: true } },
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!resume) {
      return res.status(200).json({ success: false, message: "이력서가 존재하지 않습니다." });
    }
    return res.status(200).json({ data: resume });
  } catch (error) {
    next(error);
  }
});

// 이력서 수정
router.patch("/resumes/:resumeId", authMiddleware, async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const { userId, grade } = req.user;
    const { title, content, status } = req.body;

    const resume = await prisma.resumes.findFirst({
      where: { resumeId: +resumeId },
    });
    if (!resume) {
      return res.status(404).json({ message: "이력서 조회에 실패하였습니다." });
    }
    if (grade === "USER" && userId !== resume.userId) {
      return res.status(403).json({ message: "이력서를 수정할 권한이 없습니다." });
    }
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

    await prisma.resumes.update({
      where: { resumeId: +resumeId },
      data: { title, content, status },
    });
    return res.status(200).json({ message: "이력서 수정사항이 저장되었습니다." });
  } catch (error) {
    next(error);
  }
});

// 이력서 삭제
router.delete("/resumes/:resumeId", authMiddleware, async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const { userId } = req.user;

    const resume = await prisma.resumes.findFirst({
      where: { resumeId: +resumeId },
    });
    if (!resumeId) {
      return res.status(400).json({ success: false, message: "resumeId는 필수값입니다." });
    }
    if (!resume) {
      return res.status(404).json({ success: false, message: "이력서 조회에 실패하였습니다." });
    }
    if (userId !== resume.userId) {
      return res.status(403).json({ success: false, message: "이력서를 수정할 권한이 없습니다." });
    }

    await prisma.resumes.delete({
      where: { resumeId: +resumeId },
    });

    return res.status(200).json({ message: "이력서가 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
});

export default router;
