import user from "../controllers/user.js";

import {
  create as createWord,
  update as updateWord,
  destroy as destroyWord,
  list as listWord,
  show as showWord,
} from "../controllers/wordController.js";

import {
  save as saveCredentials,
  get as getCredentials,
} from "../controllers/credentialController.js";

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
  app.get(routes.users, user.list);
  app.get(`${routes.users}/:id`, [param("id").exists().toInt()], user.show);
  app.post(
    routes.users,
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
  app.get(routes.credentials, body("username").notEmpty(), getCredentials);
  app.post(routes.credentials, body("data").notEmpty(), saveCredentials);

  // Word.
  app.get(routes.words, listWord);
  app.get(`${routes.words}/:id`, showWord);
  app.post(routes.words, createWord);
  app.post(`${routes.words}/:id`, updateWord);
  app.delete(`${routes.words}/:id`, destroyWord);

  // Translation.
  app.get(
    routes.translations,
    query("wordId").notEmpty().isNumeric(),
    listTranslation
  );

  app.post(
    routes.translations,
    query("wordId").notEmpty().isNumeric(),
    createTranslation
  );
};
