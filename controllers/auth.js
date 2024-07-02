import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { auth, prisma } from "../app.js";
import { generateErrorText, sendHttp500 } from "../helpers/api.js";
import { BCRYPT_ROUND_NUMBER } from "../settings/system.js";
import _ from "lodash";

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

    let { username, email, firstName, lastName, password, token } =
      request.body;

    const formData = new FormData();
    formData.append("secret", process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY);
    formData.append("response", token);
    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const result = await fetch(url, {
      body: formData,
      method: "POST",
    });
    const outcome = await result.json();
    if (!outcome.success) {
      return response.status(422).json({
        errors: [
          {
            path: "token",
            customMessage: "Captcha was not verified",
          },
        ],
      });
    }

    const salt = bcrypt.genSaltSync(BCRYPT_ROUND_NUMBER);
    const hash = bcrypt.hashSync(password, salt);

    username = username || email;

    const user = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (user) {
      return response.status(422).json({
        errors: [
          {
            path: "email",
            customMessage: "User with the same email already exists",
          },
        ],
      });
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

const getAuthUser = async (request, response) => {
  try {
    const user = await prisma.user.findFirst({ where: { id: auth.user.id } });

    if (!user) {
      return response.sendStatus(404);
    }

    return response.status(200).json(_.omit(user, "hash"));
  } catch (error) {
    sendHttp500({
      errorText: generateErrorText("get", "authUser"),
      error,
      response,
    });
  }
};

const saveAuthUserConfig = async (request, response) => {
  try {
    const { config } = request.body;

    await prisma.user.update({
      where: { id: auth.user.id },
      data: { config },
    });

    response.send({ success: true, data: config });
  } catch (error) {
    sendHttp500({
      errorText: generateErrorText("save", "authUserConfig"),
      error,
      response,
    });
  }
};

export default { register, login, getAuthUser, saveAuthUserConfig };
