import express from "express";
import { prisma } from "../utils/index.js";
import bcrypt from "bcrypt";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

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
        updatedAt: true,
      },
    });
    if (!userId) {
      return res.status(404).json({ message: "존재하지 않는 사용자입니다." });
    }
    return res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
});

// 개인 정보 수정
router.patch("/users", authMiddleware, async (req, res, next) => {
  try {
    const { existingPassword, password, passwordConfirm, name } = req.body;
    const { userId } = req.user;

    const user = await prisma.users.findFirst({
      where: { userId: +userId },
    });

    if (!existingPassword)
      return res.status(400).json({ success: false, message: "기존의 비밀 번호를 입력해 주세요." });

    const checkedPassword = await bcrypt.compare(existingPassword, user.password);

    if (!checkedPassword) return res.status(401).json({ success: false, message: "기존의 비밀 번호와 다릅니다." });

    let hashedPassword = user.password;

    if (password !== undefined && password !== "") {
      if (!passwordConfirm) return res.status(400).json({ message: "새로운 비밀번호 확인을 입력해 주세요" });

      if (password !== passwordConfirm)
        return res.status(400).json({
          success: false,
          message: "비밀번호와 비밀번호 확인이 다릅니다.",
        });

      if (password.length < 6 || password.length > 20)
        return res.status(400).json({
          success: false,
          message: "비밀번호는 최소 6자리 이상, 최대 20자리 이하 입니다.",
        });

      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updateData = {
      name: name !== "" ? name : user.name,
      password: hashedPassword,
    };
    await prisma.users.update({
      where: { userId: +userId },
      data: updateData,
    });

    return res.status(201).json({
      success: true,
      message: "프로필 수정이 완료되었습니다.",
    });
  } catch (err) {
    next(err);
  }
});

// 다른 사용자 조회
router.get("/users/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await prisma.users.findFirst({
      where: { userId: +userId },
    });

    if (!user) return res.status(404).json({ message: "사용자가 존재하지 않습니다." });

    const userProfile = await prisma.users.findFirst({
      where: { userId: +userId },
      select: {
        userId: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const userResume = await prisma.resumes.findMany({
      where: { userId: +userId },
      select: {
        postId: true,
        userId: true,
        name: true,
        title: true,
        content: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({ userProfile, userResume });
  } catch (err) {
    next(err);
  }
});

// 회원 탈퇴
router.delete("/user", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    await prisma.users.delete({
      where: { userId: +userId },
    });

    return res.status(200).json({ message: "회원 탈퇴되었습니다." });
  } catch (err) {
    next(err);
  }
});

export default router;
