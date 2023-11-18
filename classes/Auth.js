import jwt from "jsonwebtoken";
import { prisma } from "../app.js";

export class Authorization {
  user;

  async getUserByAuthorizationHeader(authorizationHeader) {
    const jwt = authorizationHeader?.split(" ")[1];
    return this.getUserByJwt(jwt);
  }

  setUser(user) {
    this.user = user;
  }

  async getUserByJwt(token) {
    try {
      const { userId } = jwt.verify(token, process.env.JWT_PASSPHRASE);

      const user = await prisma.user.findFirst({
        where: { id: userId },
      });

      return user ?? null;
    } catch (e) {
      return null;
    }
  }

  getUser() {
    const userCopy = { ...this.user };
    delete userCopy.hash;
    return userCopy;
  }
}
