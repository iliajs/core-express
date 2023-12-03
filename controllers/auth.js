import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../app.js";
import { generateErrorText, sendHttp500 } from "../helpers/api.js";
import { BCRYPT_ROUND_NUMBER } from "../settings/system.js";

const login = async (request, response) => {
  try {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      return response.status(422).json({ errors: validator.array() });
    }

    const { user: inputUser, password } = request.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: inputUser }, { email: inputUser }],
      },
    });

    if (!user?.id || !bcrypt.compareSync(password, user.hash)) {
      return response
        .status(401)
        .json({ error: "wrong credentials or user not found" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_PASSPHRASE, {
      expiresIn: "7d",
    });

    delete user.hash;

    return response.status(200).json({ jwt: token, user });
  } catch (error) {
    sendHttp500({
      errorText: generateErrorText("login", "auth"),
      error,
      response,
    });
  }
};

const register = async (request, response) => {
  try {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      return response.status(422).json({ errors: validator.array() });
    }

    const { username, email, firstName, lastName, password } = request.body;
    const salt = bcrypt.genSaltSync(BCRYPT_ROUND_NUMBER);
    const hash = bcrypt.hashSync(password, salt);

    const user = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (user) {
      return response.status(409).json({ error: "already exists" });
    }

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        hash,
        username,
        email,
      },
    });

    response.status(200).json({ created: true });
  } catch (error) {
    sendHttp500({
      errorText: generateErrorText("create", "user"),
      error,
      response,
    });
  }
};

export default { login, register };
