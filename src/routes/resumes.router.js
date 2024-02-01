import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 이력서 생성
router.post("/resumes", authMiddleware, async (req, res, next) => {
  const { title, content } = req.body;
  const { userId } = req.user;

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

// 이력서 상세 조회 API

// 이력서 수정 API

// 이력서 삭제 API

export default router;
