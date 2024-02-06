import express from "express";
import { prisma } from "../utils/index.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 회원가입 API
router.post("/sign-up", async (req, res, next) => {
  try {
    // throw new Error("에러 핸들링 미들웨어 테스트 에러"); // 에러테스트용
    const { clientId, email, password, password2, name, grade } = req.body;
    if (grade && !["user", "admin"].includes(grade)) {
      return res.status(400).json({ success: false, message: "권한 설정이 올바르지 않습니다." });
    }
    if (!clientId) {
      // 이메일 존재 유무
      if (!email) {
        return res.status(404).json({ message: "이메일을 입력해주세요" }); // 404 - Not Found (찾을 수 없음)
      }
      // 비밀번호 존재 유무
      if (!password) {
        return res.status(404).json({ message: "비밀번호를 입력해주세요" }); // 404 - Not Found (찾을 수 없음)
      }
      // 비밀번호의 길이
      if (password.length < 6) {
        return res.status(400).json({ message: "비밀번호는 최소 6자리 이상입니다." }); // 400 - Bad Request (잘못된요청)
      }
      // 비밀번호 확인
      if (password !== password2) {
        return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." }); // 400 - Bad Request (잘못된요청)
      }
    }

    // 이름 존재 유무
    if (!name) {
      return res.status(404).json({ message: "이름을 입력해주세요" }); // 404 - Not Found (찾을 수 없음)
    }
    // CLIENT
    if (clientId) {
      const isExisUser = await prisma.users.findFirst({
        where: { clientId }
      });
      // 가입 여부
      if (isExisUser) {
        return res.status(400).json({ success: false, message: "이미 가입된 사용자입니다." });
      }
      const user = await prisma.users.create({
        data: {
          clientId,
          name,
          grade
        }
      });
    } else {
      // EMAIL
      const isExisUser = await prisma.users.findFirst({
        where: { email }
      });
      // 가입 여부
      if (isExisUser) {
        return res.status(400).json({ success: false, message: "이미 가입된 이메일입니다." });
      }
      // 비밀번호 복호화
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.users.create({
        data: {
          email,
          password: hashedPassword, // 암호화된 비밀번호를 저장합니다.
          name,
          grade
        }
      });
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
    const { clientId, email, password } = req.body;
    let user;
    if (clientId) {
      user = await prisma.users.findFirst({
        where: {
          clientId
        }
      });
      if (!user) return res.status(404).json({ message: "존재하지 않는 아이디입니다." }); // 404 - Not Found (찾을 수 없음)
    } else {
      // 이메일 존재 유무
      if (!email) {
        return res.status(404).json({ message: "이메일을 입력해주세요" }); // 404 - Not Found (찾을 수 없음)
      }
      // 비밀번호 존재 유무
      if (!password) {
        return res.status(404).json({ message: "비밀번호를 입력해주세요" }); // 404 - Not Found (찾을 수 없음)
      }
      user = await prisma.users.findFirst({ where: { email } });

      if (!user) return res.status(404).json({ message: "존재하지 않는 이메일입니다." }); // 404 - Not Found (찾을 수 없음)
      if (!(await bcrypt.compare(password, user.password)))
        return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." }); // 400 - Bad Request (잘못된요청)
    }

    //쿠키할당 만료시간 12시간
    const token = generateToken({ userId: user.userId }); // jwt.sign 모듈화
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
    if (!userId) {
      return res.status(404).json({ message: "존재하지 않는 사용자입니다." }); // 404 - Not Found (찾을 수 없음)
    }
    return res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
});

// 개인 정보 수정

export default router;
