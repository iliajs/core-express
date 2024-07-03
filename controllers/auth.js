import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { auth, prisma } from "../app.js";
import {
  generateErrorText,
  sendCaptchaError,
  sendHttp500,
} from "../helpers/api.js";
import { BCRYPT_ROUND_NUMBER } from "../settings/system.js";
import _ from "lodash";
import { Email } from "../classes/Email.js";
import { Captcha } from "../classes/Captcha.js";

const login = async (request, response) => {
  try {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      return response.status(422).json({ errors: validator.array() });
    }

    const { user: inputUser, password, token } = request.body;

    if (!(await Captcha.check(token))) {
      return sendCaptchaError(response);
    }

    const user = await prisma.user.findFirst({
      where: {
        email: inputUser,
        active: true,
      },
    });

    if (!user?.id || !bcrypt.compareSync(password, user.hash)) {
      return response
        .status(401)
        .json({ error: "wrong credentials or user not found" });
    }

    const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_PASSPHRASE, {
      expiresIn: "7d",
    });

    delete user.hash;

    return response.status(200).json({ jwt: jwtToken, user });
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

    if (!(await Captcha.check(token))) {
      return sendCaptchaError(response);
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

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        hash,
        username,
        email,
        authCode: code,
        active: false,
      },
    });

    const mailjetRequest = Email.send(
      { email: "registration@self-platform.es", name: "Self-Platform.es" },
      { email },
      "Confirm Your Email",
      "<h4>Dear customer!</h4>" +
        'We are really happy that you are registered in our application <a href="http://self-platform.es">Self-Platform.es</a>' +
        `<br/><br/>To confirm your email, please click <a href="http://self-platform.es/login?email=${email}&code=${code}">this link</a>` +
        "<br /><br/>Thanks a lot and hope see you soon!"
    );

    mailjetRequest
      .then(() => {
        response.status(200).json({ created: true });
      })
      .catch((err) => {
        response
          .status(500)
          .json({ errors: ["Email confirmation code was not sent"] });
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
