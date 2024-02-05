import express from "express";
import { prisma } from "../utils/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 이력서 생성 API
router.post("/resumes", authMiddleware, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const { userId } = req.user;

    if (!title) {
      return res.status(404).json({ message: "제목을 입력해주세요." }); // 404 - Not Found (찾을 수 없음)
    }
    if (!content) {
      return res.status(404).json({ message: "내용을 입력해주세요" }); // 404 - Not Found (찾을 수 없음)
    }
    const resume = await prisma.resumes.create({
      data: {
        userId: +userId,
        title,
        content
      }
    });
    return res.status(201).json({ message: "이력서가 등록되었습니다." });
  } catch (error) {
    next(error);
  }
});

// 모든 이력서 목록 조회 API
router.get("/resumes", async (req, res, next) => {
  try {
    const resume = await prisma.resumes.findMany({
      select: {
        resumeId: true,
        userId: true,
        title: true,
        content: true,
        user: { select: { name: true } },
        status: true,
        createdAt: true,
        updatedAt: true
      },
      // QueryString 왜 사용하는지 모르겠음.
      orderBy: {
        createdAt: "desc"
      }
    });
    return res.status(200).json({ data: resume });
  } catch (error) {
    next(error);
  }
});

// 이력서 상세 조회 API
router.get("/resumes/:resumeId", async (req, res, next) => {
  try {
    const { resumeId } = req.params;
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
        updatedAt: true
      }
    });
    return res.status(200).json({ data: resume });
  } catch (error) {
    next(error);
  }
});

// 이력서 수정 API
router.patch("/resumes/:resumeId", authMiddleware, async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const { userId } = req.user;
    const { title, content, status } = req.body;

    const resume = await prisma.resumes.findFirst({
      where: { resumeId: +resumeId }
    });
    if (!resume) {
      return res.status(404).json({ message: "이력서 조회에 실패하였습니다." }); // 404 - Not Found (찾을 수 없음)
    }
    if (userId !== resume.userId) {
      return res.status(403).json({ message: "이력서를 수정할 권한이 없습니다." }); // 403 - Forbidden (금지됨)
    } else
      await prisma.resumes.update({
        data: { title, content, status },
        where: { resumeId: +resumeId }
      });

    return res.status(200).json({ message: "이력서 수정사항이 저장되었습니다." });
  } catch (error) {
    next(error);
  }
});

// 이력서 삭제 API
router.delete("/resumes/:resumeId", authMiddleware, async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const { userId } = req.user;

    const resume = await prisma.resumes.findFirst({
      where: { resumeId: +resumeId }
    });
    if (!resume) {
      return res.status(404).json({ message: "이력서 조회에 실패하였습니다." }); // 404 - Not Found (찾을 수 없음)
    }
    if (userId !== resume.userId) {
      return res.status(403).json({ message: "이력서를 수정할 권한이 없습니다." }); // 403 - Forbidden (금지됨)
    }

    await prisma.resumes.delete({
      where: { resumeId: +resumeId }
    });

    return res.status(200).json({ message: "이력서가 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
});

export default router;
