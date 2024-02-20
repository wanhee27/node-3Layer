import express from "express";
import { prisma } from "../utils/index.js";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../utils/jwt.js";
import { generateRefreshToken } from "../utils/jwt.js";
import { verifyRefreshToken } from "../utils/jwt.js";
const router = express.Router();

router.post("/", async (req, res, next) => {
  const { refreshToken } = req.body;
  const token = verifyRefreshToken(refreshToken);
  if (!token.userId) {
    return res.status(401).end();
  }
  const user = await prisma.users.findFirst({
    userId: token.userId,
  });
  const newAccessToken = jwt.sign({ userId: user.userId }, generateAccessToken);
  const newRefreshToken = jwt.sign({ userId: user.userId }, generateRefreshToken);

  return res.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
});

export default router;
