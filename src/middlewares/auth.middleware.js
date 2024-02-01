import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma/index.js";

export default async function (req, res, next) {
  try {
    // 쿠키를 토큰에 저장하고 검증하는과정 대신 세션사용으로 주석처리
    const { authorization } = req.cookies;
    if (!authorization) throw new Error("요청한 사용자의 토큰이 존재하지 않습니다.");

    const [tokenType, token] = authorization.split(" ");
    if (tokenType !== "Bearer") throw new Error("토큰 타입이 Bearer 형식이 아닙니다.");

    const decodedToken = jwt.verify(token, "custom-secret-key");
    const userId = decodedToken.userId;

    const user = await prisma.users.findFirst({
      where: { userId: +userId }
    });
    if (!user) throw new Error("토큰 사용자가 존재하지 않습니다.");

    req.user = user;

    next();
  } catch (error) {
    // 토큰 에러도 주석처리
    if (error.name === "TokenExpiredError") return res.status(401).json({ message: "토큰이 만료되었습니다." });
    if (error.name === "JsonWebTokenError") return res.status(401).json({ message: "토큰이 조작되었습니다." });
    return res.status(400).json({ message: error.message });
  }
}
