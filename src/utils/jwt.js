import jwt from "jsonwebtoken";

// 초기 payload를 통한 토큰 생성
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: "1h" });
};
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: "7d" });
};

// 생성된 토큰 유효성 검증 토큰
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
};
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
};

const generateEmailToken = (userId, email) => {
  const payload = {
    userId: userId,
    email: email,
  };

  // 이메일 인증 토큰 생성
  const token = jwt.sign(payload, process.env.EMAIL_VERIFY_TOKEN_KEY, { expiresIn: "24h" });

  return token;
};

const verifyEmailToken = (token) => {
  return jwt.verify(token, process.env.EMAIL_VERIFY_TOKEN_KEY);
};

export {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateEmailToken,
  verifyEmailToken,
};
