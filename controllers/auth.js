import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { BCRYPT_ROUND_NUMBER } from "../settings/security.js";
import jwt from "jsonwebtoken";
import { prisma } from "../app.js";
import chalk from "chalk";
import { generateErrorText, sendError } from "../helpers/api.js";

const register = async (request, response) => {
  const validator = validationResult(request);
  if (!validator.isEmpty()) {
    return response.status(403).json({ errors: validator.array() });
  }

  const { username, email, firstName, lastName, password } = request.body;
  const salt = bcrypt.genSaltSync(BCRYPT_ROUND_NUMBER);
  const hash = bcrypt.hashSync(password, salt);

  const user = await prisma.users.findFirst({
    where: { OR: [{ username }, { email }] },
  });

  try {
    if (user) {
      return response.status(409).json({ error: "already exists" });
    }

    await prisma.users.create({
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
  const validator = validationResult(request);
  if (!validator.isEmpty()) {
    return response.status(403).json({ errors: validator.array() });
  }

  const { user: inputUser, password } = request.body;

  const user = await prisma.users.findFirst({
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
};

const authorization = async (request, response) => {
  const validator = validationResult(request);
  if (!validator.isEmpty()) {
    return response.status(403).json({ errors: validator.array() });
  }

  const { token } = request.body;

  const notAuthorized = () => {
    return response.status(401).json({ error: "not authorized" });
  };

  try {
    const { userId } = jwt.verify(token, process.env.JWT_PASSPHRASE);

    const user = await prisma.users.findFirst({
      where: { id: userId },
    });

    if (user) {
      return response.status(200).json({ authorized: true, user });
    } else {
      return notAuthorized();
    }
  } catch (e) {
    console.error(chalk.redBright("jwt is failed"));
    return notAuthorized();
  }
};

export default { register, login, authorization };
