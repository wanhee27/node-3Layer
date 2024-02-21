import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/users.repository.js";

export class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }
  getUserInfo = async (userId) => {
    return this.userRepository.findById(userId);
  };

  updateUserInfo = async (userId, existingPassword, password, passwordConfirm, name) => {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }
    if (!existingPassword) {
      throw new Error("기존의 비밀 번호를 입력해 주세요.");
    }
    const checkedPassword = await bcrypt.compare(existingPassword, user.password);

    if (!checkedPassword) {
      throw new Error("기존의 비밀 번호와 다릅니다.");
    }
    let hashedPassword = user.password;

    if (password !== undefined && password !== "") {
      if (!passwordConfirm) throw new Error("새로운 비밀번호 확인을 입력해 주세요");

      if (password !== passwordConfirm) throw new Error("비밀번호와 비밀번호 확인이 다릅니다.");

      if (password.length < 6 || password.length > 20)
        throw new Error("비밀번호는 최소 6자리 이상, 최대 20자리 이하 입니다.");

      hashedPassword = await bcrypt.hash(password, 10);
    }
    return this.userRepository.updateUserInfo(userId, name, hashedPassword);
  };

  getOtherInfo = async (userId) => {
    return this.userRepository.findOtherUserInfo(userId);
  };

  deleteUser = async (userId) => {
    return this.userRepository.deleteUserData(userId);
  };
}
