import auth from "../controllers/auth.js";
import credential from "../controllers/credential.js";
import googleDrive from "../controllers/googleDrive.js";
import system from "../controllers/system.js";
import translation from "../controllers/translation.js";
import user from "../controllers/user.js";
import word from "../controllers/word.js";

import { routes } from "../settings/routes.js";

import { body, param, query } from "express-validator";

export const router = (app) => {
  // System.
  app.get(routes.system, system.info);
  app.post(routes.googleDrive, googleDrive.upload);

  // Register.
  app.post(
    routes.register,
    [
      body("username").notEmpty(), // TODO add trim here and for 4 lines below
      body("email").isEmail(),
      body("firstName").notEmpty(),
      body("lastName").notEmpty(),
      body("password").notEmpty(),
    ],
    auth.register
  );

  // Login.
  app.post(
    routes.login,
    [
      body("data").isLength({ min: 2, max: 50 }),
      body("password").isStrongPassword({ minSymbols: 0 }),
    ],
    auth.login
  );

  // Authorization.
  app.post(routes.authorization, [body("token").isJWT()], auth.authorization);

  // Users.
  app.get(routes.user, user.list);
  app.get(`${routes.user}/:id`, [param("id").exists().toInt()], user.show);

  // Credentials.
  app.get(routes.credential, body("username").notEmpty(), credential.get);
  app.put(routes.credential, body("data").notEmpty(), credential.update);

  // Words.
  app.get(routes.word, word.list);
  app.get(`${routes.word}/:id`, word.show);
  app.post(routes.word, word.create);
  app.post(`${routes.word}/:id`, word.update);
  app.delete(`${routes.word}/:id`, word.destroy);

  // Translations.
  app.get(
    routes.translation,
    query("wordId").notEmpty().isNumeric(),
    translation.list
  );

  app.post(
    routes.translation,
    query("wordId").notEmpty().isNumeric(),
    translation.create
  );
};
