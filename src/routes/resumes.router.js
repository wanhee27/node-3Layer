import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 이력서 생성
router.post("/resumes", authMiddleware, async (req, res, next) => {
  const { title, content } = req.body;
  const { userId } = req.user;

  if (!title) {
    return res.status(401).json({ message: "제목을 입력해주세요." });
  }
  if (!content) {
    return res.status(401).json({ message: "내용을 입력해주세요" });
  }
  const resume = await prisma.resumes.create({
    data: {
      userId: +userId,
      title,
      content
    }
  });

  return res.status(201).json({ message: "이력서가 등록되었습니다." });
});

// 모든 이력서 조회 API
router.get("/resumes", async (req, res, next) => {
  const resume = await prisma.resumes.findMany({
    select: {
      resumeId: true,
      userId: true,
      title: true,
      content: true,
      user: { select: { name: true } },
      createdAt: true,
      updatedAt: true
    },
    // QueryString 왜 사용하는지 모르겠음.
    orderBy: {
      createdAt: "desc"
    }
  });
  return res.status(200).json({ data: resume });
});
// 이력서 상세 조회 API
// 이력서 ID, 이력서 제목, 자기소개, 작성자명, 이력서 상태, 작성 날짜 조회하기
router.get("/resumes/:resumeId", async (req, res, next) => {
  const { resumeId } = req.params;
  const resume = await prisma.resumes.findFirst({
    where: { resumeId: +resumeId },
    select: {
      resumeId: true,
      userId: true,
      title: true,
      content: true,
      user: { select: { name: true } },
      createdAt: true,
      updatedAt: true
    }
  });
  return res.status(200).json({ data: resume });
});

// 이력서 수정 API

// 이력서 삭제 API

export default router;
