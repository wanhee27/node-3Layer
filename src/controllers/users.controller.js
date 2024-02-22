import { UserService } from "../services/users.service.js";

export class UserController {
  constructor() {
    this.userService = new UserService();
  }

  userInfo = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const user = await this.userService.getUserInfo(userId);
      if (!userId) {
        return res.status(404).json({ message: "존재하지 않는 사용자입니다." });
      }
      return res.status(200).json({ data: user });
    } catch (error) {
      next(error);
    }
  };

  userUpdate = async (req, res, next) => {
    try {
      const { existingPassword, password, passwordConfirm, name } = req.body;
      const { userId } = req.user;
      await this.userService.updateUserInfo(
        userId,
        existingPassword,
        password,
        passwordConfirm,
        name
      );
      return res.status(201).json({
        success: true,
        message: "프로필 수정이 완료되었습니다.",
      });
    } catch (err) {
      next(err);
    }
  };
  otherInfo = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const userInfo = await this.userService.getOtherInfo(userId);
      return res.status(200).json(userInfo);
    } catch (err) {
      next(err);
    }
  };
  userLeave = async (req, res, next) => {
    try {
      const { userId } = req.user;
      await this.userService.deleteUser(userId);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(200).json({ message: "회원 탈퇴되었습니다." });
    } catch (err) {
      next(err);
    }
  };
}
