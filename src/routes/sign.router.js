import express from "express";
import { prisma } from "../utils/index.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  generateEmailToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { sendMail } from "../utils/email.js";
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

// //회원가입 API
// router.post("/sign-up", async (req, res, next) => {
//   try {
//     const { email, password, passwordConfirm, name, grade = "UNVERIFIED" } = req.body;

//     if (grade && !["UNVERIFIED", "USER", "ADMIN"].includes(grade)) {
//       return res.status(400).json({ success: false, message: "권한 설정이 올바르지 않습니다." });
//     }
//     if (!email) {
//       return res.status(400).json({ success: false, message: "이메일을 입력해주세요" });
//     }

//     if (!password) {
//       return res.status(400).json({ success: false, message: "비밀번호를 입력해주세요" });
//     }

//     if (password.length < 6 || password.length > 20) {
//       return res.status(400).json({
//         success: false,
//         message: "비밀번호는 최소 6자리 이상, 최대 20자리 이하 입니다.",
//       });
//     }

//     if (password !== passwordConfirm) {
//       return res.status(400).json({ success: false, message: "비밀번호가 일치하지 않습니다." });
//     }

//     if (!name) {
//       return res.status(400).json({ success: false, message: "이름을 입력해주세요" });
//     }

//     const isExistUser = await prisma.users.findFirst({
//       where: { email },
//     });

//     if (isExistUser) {
//       return res.status(409).json({ success: false, message: "이미 가입된 이메일입니다." });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await prisma.users.create({
//       data: {
//         email,
//         password: hashedPassword,
//         name,
//         grade,
//       },
//     });

//     let emailToken;
//     if (grade === "ADMIN") {
//       emailToken = null;
//     } else {
//       emailToken = generateEmailToken(user.userId, user.email);
//     }

//     if (emailToken) {
//       await sendMail(email, emailToken);
//     }
//     return res.status(201).json({
//       success: true,
//       email,
//       name,
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// //로그인 API
// router.post("/sign-in", async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     if (!email) {
//       return res.status(400).json({ success: false, message: "이메일을 입력해주세요" });
//     }

//     if (!password) {
//       return res.status(400).json({ success: false, message: "비밀번호를 입력해주세요" });
//     }

//     const user = await prisma.users.findFirst({ where: { email } });

//     if (!user) {
//       return res.status(404).json({ success: false, message: "존재하지 않는 이메일입니다." });
//     }

//     if (!(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ success: false, message: "비밀번호가 일치하지 않습니다." });
//     }

//     if (user.grade === "UNVERIFIED") {
//       return res.status(403).json({ success: false, message: "이메일 인증이 필요합니다." });
//     }

//     const accessToken = generateAccessToken({ userId: user.userId });
//     const refreshToken = generateRefreshToken({ userId: user.userId });
//     res.cookie("accessToken", `Bearer ${accessToken}`);
//     res.cookie("refreshToken", `Bearer ${refreshToken}`);
//     return res.status(200).json({ success: true, message: "로그인에 성공하였습니다." });
//   } catch (err) {
//     next(err);
//   }
// });

// //로그아웃 API
// router.post("/sign-out", authMiddleware, async (req, res, next) => {
//   try {
//     res.clearCookie("accessToken");
//     res.clearCookie("refreshToken");

//     return res.status(200).json({ success: true, message: "로그아웃 되었습니다." });
//   } catch (err) {
//     next(err);
//   }
// });

// //AccessToken 재발급 API
// router.post("/refresh", async (req, res, next) => {
//   try {
//     const { refreshToken } = req.cookies;
//     if (!refreshToken) {
//       return res.status(400).json({ success: false, message: "refreshToken이 없습니다." });
//     }
//     const [tokenType, token] = refreshToken.split(" ");
//     const refreshTokenData = verifyRefreshToken(token);
//     const newToken = generateAccessToken({ userId: refreshTokenData.userId });
//     res.cookie("accessToken", `Bearer ${newToken}`);
//     return res.status(201).json({ success: true, message: "accessToken이 재발급되었습니다." });
//   } catch (err) {
//     next(err);
//   }
// });

export default router;
