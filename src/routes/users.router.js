import express from "express";
import { prisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 회원가입 API
router.post("/sign-up", async (req, res, next) => {
  try {
    // throw new Error("에러 핸들링 미들웨어 테스트 에러"); // 에러테스트용
    const { email, password, password2, name } = req.body;
    const isExisUser = await prisma.users.findFirst({
      where: { email }
    });
    // 이메일 존재 유무
    if (!email) {
      return res.status(400).json({ message: "이메일을 입력해주세요" });
    }
    // 중복된 이메일
    if (isExisUser) {
      return res.status(400).json({ message: "이미 존재하는 이메일입니다." });
    }
    // 비밀번호 존재 유무
    if (!password) {
      return res.status(400).json({ message: "비밀번호를 입력해주세요" });
    }
    // 비밀번호의 길이
    if (password.length < 6) {
      return res.status(400).json({ message: "비밀번호는 최소 6자리 이상입니다." });
    }
    // 비밀번호 확인
    if (password !== password2) {
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    }
    // 비밀번호 복호화
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword, // 암호화된 비밀번호를 저장합니다.
        name
      }
    });
    // 이름 존재 유무
    if (!name) {
      return res.status(400).json({ message: "이름을 입력해주세요" });
    }
    // 데이터 출력
    return res.status(201).json({ email, name });
  } catch (error) {
    next(error);
  }
});

// 로그인 API
router.post("/sign-in", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // 이메일 존재 유무
    if (!email) {
      return res.status(400).json({ message: "이메일을 입력해주세요" });
    }
    // 비밀번호 존재 유무
    if (!password) {
      return res.status(400).json({ message: "비밀번호를 입력해주세요" });
    }
    const user = await prisma.users.findFirst({ where: { email } });

    if (!user) return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

    //쿠키할당 만료시간 12시간
    const token = jwt.sign({ userId: user.userId }, process.env.TOKEN_SECRET_KEY, { expiresIn: "12h" });
    res.cookie("authorization", `Bearer ${token}`);

    // 출력
    return res.status(200).json({ message: "로그인에 성공하였습니다." });
  } catch (error) {
    next(error);
  }
});

// 개인 정보 조회
router.get("/users", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await prisma.users.findFirst({
      where: { userId: +userId },
      select: {
        userId: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
});

// 개인 정보 수정

export default router;
