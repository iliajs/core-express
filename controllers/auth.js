import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { BCRYPT_ROUND_NUMBER } from "../settings/security.js";
import { User } from "../db/models/User.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";

const register = async (request, response) => {
  const validator = validationResult(request);
  if (!validator.isEmpty()) {
    return response.status(403).json({ errors: validator.array() });
  }

  const { username, email, firstName, lastName, password } = request.body;
  const salt = bcrypt.genSaltSync(BCRYPT_ROUND_NUMBER);
  const hash = bcrypt.hashSync(password, salt);

  const [, created] = await User.findOrCreate({
    where: { [Op.or]: [{ username }, { email }] },
    defaults: {
      firstName,
      lastName,
      hash,
      username,
      email,
    },
  });

  if (created) {
    response.status(200).json({ created: true });
  } else {
    response.status(409).json({ error: "already exists" });
  }
};

const login = async (request, response) => {
  const validator = validationResult(request);
  if (!validator.isEmpty()) {
    return response.status(403).json({ errors: validator.array() });
  }

  const { user: inputUser, password } = request.body;
  const user = await User.findOne({
    where: { [Op.or]: [{ username: inputUser }, { email: inputUser }] },
    attributes: ["id", "hash"],
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

    const user = await User.findOne({
      where: { id: userId },
    });

    if (user) {
      return response.status(200).json({ authorized: true, user });
    } else {
      return notAuthorized();
    }
  } catch (e) {
    console.error(e);
    return notAuthorized();
  }
};

export default { register, login, authorization };
