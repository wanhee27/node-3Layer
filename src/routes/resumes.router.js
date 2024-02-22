import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { ResumeController } from "../controllers/resumes.controller.js";

const router = express.Router();

const resumeController = new ResumeController();

// 이력서 생성
router.post("/resumes", authMiddleware, resumeController.createResume);
// 모든 이력서 목록 조회
router.get("/resumes", resumeController.findAllResume);
// 이력서 상세 조회
router.get("/resumes/:resumeId", resumeController.findOneResume);
// 이력서 수정
router.patch("/resumes/:resumeId", authMiddleware, resumeController.updateResume);
// 이력서 삭제
router.delete("/resumes/:resumeId", authMiddleware, resumeController.deleteResume);

export default router;
