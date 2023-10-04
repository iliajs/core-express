import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { User } from "../db/models/User.js";
import { BCRYPT_ROUND_NUMBER } from "../settings/security.js";
import { prisma } from "../app.js";

const list = async (request, response) => {
  const data = (await prisma.user.findMany()).map((item) => {
    delete item.hash;
    return item;
  });

  return response.status(200).json({ success: true, data });
};

const show = async (request, response) => {
  // TODO Move to prisma
  const { id } = request.params;
  const user = await User.findByPk(id);
  return response.status(200).json(user);
};

const create = async (request, response) => {
  const validator = validationResult(request);

  if (!validator.isEmpty()) {
    return response.status(403).json({ errors: validator.array() });
  }

  const { username, email, firstName, lastName, password } = request.body;
  const salt = bcrypt.genSaltSync(BCRYPT_ROUND_NUMBER);
  const hash = bcrypt.hashSync(password, salt);

  const [user, created] = await User.findOrCreate({
    where: { username },
    defaults: {
      email,
      firstName,
      lastName,
      hash,
    },
  });

  response.status(200).json({
    created,
    exists: !created,
    data: user,
  });
};

export default { list, show, create };
