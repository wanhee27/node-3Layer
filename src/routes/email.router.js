import express from "express";
import { prisma } from "../utils/index.js";
import { verifyEmailToken } from "../utils/jwt.js";

const router = express.Router();

// 이메일 인증 확인 라우터
router.get("/verify-email/:token", async (req, res, next) => {
  try {
    const token = req.params.token;

    // 토큰 검증
    const decodedToken = verifyEmailToken(token);

    // 사용자 인증 상태 업데이트
    await prisma.users.update({
      where: {
        userId: decodedToken.userId
      },
      data: {
        grade: "user"
      }
    });

    res.status(200).json({ message: "이메일 인증이 완료되었습니다. 이제 로그인할 수 있습니다." });
  } catch (error) {
    next(error);
  }
});

export default router;
