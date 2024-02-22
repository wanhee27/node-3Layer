import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { SignController } from "../controllers/sign.controller.js";

const router = express.Router();

const signController = new SignController();
// 회원가입 API
router.post("/sign-up", signController.signUp);
// 로그인
router.post("/sign-in", signController.signIn);
// 로그아웃
router.post("/sign-out", authMiddleware, signController.signOut);
// 토큰 재발급
router.post("/refresh", signController.reFresh);

export default router;
