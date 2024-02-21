import { prisma } from "../utils/index.js";

export class SignRepository {
  constructor() {
    this.prisma = prisma;
  }
  async createUser(email, hashedPassword, name, grade) {
    return this.prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
        grade,
      },
    });
  }

  async findUserByEmail(email) {
    return this.prisma.users.findFirst({ where: { email } });
  }
}
