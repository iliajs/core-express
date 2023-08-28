import pool from "../db/pool.js";
import { UserModel } from "../models/UserModel.js";
import { TOKEN_TYPES } from "../settings/index.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { BCRYPT_ROUND_NUMBER } from "../settings/security.js";
import { User } from "../db/models/User.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";

const modelUser = new UserModel();

// TODO: Need to restore;
export const authWithOneTimeToken = async (req, response) => {
  const token = req.body.token;
  try {
    const res = await pool.query(
      "select * from users where login_token=$1 and login_until > CURRENT_TIMESTAMP",
      [token]
    );
    if (res && res.rows && res.rows.length) {
      // Clean login_until column value because token can be used only once.
      const telegramUserId = res.rows[0].telegram_user_id;
      const token = await modelUser.setLoginToken(
        telegramUserId,
        TOKEN_TYPES.permanent
      );
      await pool.query(
        "update users set login_until=null where login_token=$1",
        [token]
      );
      response.status(200).json({ success: true, permanentToken: token });
    } else {
      response.status(200).json({ success: false, error: "wrong_token" });
    }
  } catch (e) {
    console.error("error select token from users table", e);
    response.status(200).json({ success: false, error: "system_error" });
  }
};

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

  const { data, password } = request.body;
  const user = await User.findOne({
    where: { [Op.or]: [{ username: data }, { email: data }] },
    attributes: ["id", "hash"],
  });

  if (!user.id || !bcrypt.compareSync(password, user.hash)) {
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

  try {
    const res = jwt.verify(token, process.env.JWT_PASSPHRASE);
    return response.status(200).json({ authorized: true, res });
  } catch (e) {
    return response.status(401).json({ error: "not authorized" });
  }
};

export default { register, login, authorization };
