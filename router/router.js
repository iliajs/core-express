import credential from "../controllers/credential.js";
import user from "../controllers/user.js";
import word from "../controllers/word.js";

import {
  list as listTranslation,
  create as createTranslation,
} from "../controllers/translationController.js";

import { routes } from "../settings/routes.js";
import { system } from "../controllers/system.js";
import { body, param, query } from "express-validator";
import { upload } from "../controllers/googleDrive.js";

export const router = (app) => {
  // System.
  app.get(routes.system, system);
  app.post(routes.googleDrive, upload);

  // User.
  app.get(routes.user, user.list);
  app.get(`${routes.user}/:id`, [param("id").exists().toInt()], user.show);
  app.post(
    routes.user,
    [
      body("username").notEmpty(),
      body("email").isEmail(),
      body("firstName").notEmpty(),
      body("lastName").notEmpty(),
      body("password").notEmpty(),
    ],
    user.create
  );

  // Credential.
  app.get(routes.credential, body("username").notEmpty(), credential.get);
  app.put(routes.credential, body("data").notEmpty(), credential.update);

  // Word.
  app.get(routes.word, word.list);
  app.get(`${routes.word}/:id`, word.show);
  app.post(routes.word, word.create);
  app.post(`${routes.word}/:id`, word.update);
  app.delete(`${routes.word}/:id`, word.destroy);

  // Translation.
  app.get(
    routes.translation,
    query("wordId").notEmpty().isNumeric(),
    listTranslation
  );

  app.post(
    routes.translation,
    query("wordId").notEmpty().isNumeric(),
    createTranslation
  );
};
