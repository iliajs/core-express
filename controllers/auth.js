import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { BCRYPT_ROUND_NUMBER } from "../settings/security.js";
import jwt from "jsonwebtoken";
import { prisma } from "../app.js";
import { generateErrorText, sendError } from "../helpers/api.js";

const register = async (request, response) => {
  try {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      return response.status(403).json({ errors: validator.array() });
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
    sendError({
      errorText: generateErrorText("create", "user"),
      error,
      response,
    });
  }
};

const login = async (request, response) => {
  try {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      return response.status(403).json({ errors: validator.array() });
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

    return response.status(200).json({ jwt: token });
  } catch (error) {
    sendError({
      errorText: generateErrorText("login", "auth"),
      error,
      response,
    });
  }
};

export default { register, login };
