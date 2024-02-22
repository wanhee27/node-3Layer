import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { UserController } from "../controllers/users.controller.js";

const router = express.Router();
const userController = new UserController();
// 개인 정보 조회
router.get("/users", authMiddleware, userController.userInfo);
// 개인 정보 수정
router.patch("/users", authMiddleware, userController.userUpdate);
// 다른 사용자 조회
router.get("/users/:userId", userController.otherInfo);
// 회원 탈퇴
router.delete("/user", authMiddleware, userController.userLeave);

export default router;
