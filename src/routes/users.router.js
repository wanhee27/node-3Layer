import express from "express";
import { prisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/auth.middleware.js";
import { Prisma } from "@prisma/client";

const router = express.Router();

// 회원가입 API
router.post("/sign-up", async (req, res, next) => {
  const { email, password, password2, name } = req.body;
  const isExisUser = await prisma.users.findFirst({
    where: { email }
  });
  // 중복된 이메일
  if (isExisUser) {
    return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
  }
  // 비밀번호의 길이
  if (password.length < 6) {
    return res.status(400).json({ message: "비밀번호는 최소 6자리 이상입니다." });
  }
  // 비밀번호 확인
  if (password !== password2) {
    return res.status(409).json({ message: "비밀번호가 일치하지 않습니다." });
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

  return res.status(201).json({ email, name });
});

// 로그인 API
router.post("/sign-in", async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.users.findFirst({ where: { email } });

  if (!user) return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
  if (!(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

  //쿠키할당
  const token = jwt.sign({ userId: user.userId }, "custom-secret-key");
  res.cookie("authorization", `Bearer ${token}`);

  // 출력
  return res.status(200).json({ message: "로그인에 성공하였습니다." });
});

export default router;
