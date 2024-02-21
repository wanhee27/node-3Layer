import { SignService } from "../services/sign.service.js";

export class SignController {
  constructor() {
    this.signService = new SignService();
  }

  signUp = async (req, res, next) => {
    try {
      const { email, password, passwordConfirm, name, grade = "UNVERIFIED" } = req.body;
      const signUpUser = await this.signService.signUpUser(
        email,
        password,
        passwordConfirm,
        name,
        grade
      );

      return res.status(201).json({
        success: true,
        data: signUpUser,
        message: "로그인에 성공하였습니다.",
      });
    } catch (err) {
      next(err);
    }
  };

  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const signInUser = await this.signService.signInUser(email, password);

      res.cookie("accessToken", `Bearer ${signInUser.accessToken}`);
      res.cookie("refreshToken", `Bearer ${signInUser.refreshToken}`);

      return res.status(201).json({
        success: true,
        message: "로그인에 성공하였습니다.",
      });
    } catch (err) {
      next(err);
    }
  };

  signOut = async (req, res, next) => {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(201).json({
        success: true,
        message: "로그아웃 되었습니다.",
      });
    } catch (err) {
      next(err);
    }
  };

  reFresh = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;
      const newToken = await this.signService.reFresh(refreshToken);
      res.cookie("accessToken", `Bearer ${newToken}`);
      return res.status(201).json({
        success: true,
        message: "토큰이 재발급되었습니다.",
      });
    } catch (err) {
      next(err);
    }
  };
}
