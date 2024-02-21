import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  generateEmailToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { sendMail } from "../utils/email.js";
import { SignRepository } from "../repositories/sign.repository.js";

export class SignService {
  constructor() {
    this.signRepository = new SignRepository();
  }

  signUpUser = async (email, password, passwordConfirm, name, grade) => {
    try {
      if (grade && !["UNVERIFIED", "USER", "ADMIN"].includes(grade)) {
        throw new Error("권한 설정이 올바르지 않습니다.");
      }
      if (!email) {
        throw new Error("이메일을 입력해주세요");
      }

      if (!password) {
        throw new Error("비밀번호를 입력해주세요");
      }

      if (password.length < 6 || password.length > 20) {
        throw new Error("비밀번호는 최소 6자리 이상, 최대 20자리 이하 입니다.");
      }

      if (password !== passwordConfirm) {
        throw new Error("비밀번호가 일치하지 않습니다.");
      }

      if (!name) {
        throw new Error("이름을 입력해주세요");
      }

      const isExistUser = await this.signRepository.findUserByEmail(email);
      if (isExistUser) {
        throw new Error("이미 가입된 이메일입니다.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const signUpUser = await this.signRepository.createUser(
        email,
        hashedPassword,
        name,
        (grade = "UNVERIFIED")
      );

      let emailToken;
      if (grade === "ADMIN") {
        emailToken = null;
      } else {
        emailToken = generateEmailToken(signUpUser.userId, signUpUser.email);
      }

      if (emailToken) {
        await sendMail(email, emailToken);
      }
    } catch (err) {
      throw err;
    }
  };

  signInUser = async (email, password) => {
    try {
      if (!email) {
        throw new Error("이메일을 입력해주세요");
      }

      if (!password) {
        throw new Error("비밀번호를 입력해주세요");
      }
      const user = await this.signRepository.findUserByEmail(email);
      if (!user) {
        throw new Error("존재하지 않는 이메일입니다.");
      }

      if (!(await bcrypt.compare(password, user.password))) {
        throw new Error("비밀번호가 일치하지 않습니다.");
      }

      if (user.grade === "UNVERIFIED") {
        throw new Error("이메일 인증이 필요합니다.");
      }

      const accessToken = generateAccessToken({ userId: user.userId });
      const refreshToken = generateRefreshToken({ userId: user.userId });
      return { accessToken, refreshToken };
    } catch (err) {
      throw err;
    }
  };

  reFresh = async (refreshToken) => {
    try {
      if (!refreshToken) {
        throw new Error("refreshToken이 없습니다.");
      }
      const [tokenType, token] = refreshToken.split(" ");
      const refreshTokenData = verifyRefreshToken(token);
      const newToken = generateAccessToken({ userId: refreshTokenData.userId });
      return newToken;
    } catch (error) {
      throw error;
    }
  };
}
