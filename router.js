import auth from "./controllers/auth.js";
import googleDrive from "./controllers/googleDrive.js";
import system from "./controllers/system.js";
import tag from "./controllers/tag.js";
import translation from "./controllers/translation.js";
import user from "./controllers/user.js";
import word from "./controllers/word.js";
import fileStorage from "./controllers/fileStorage.js";

import { routes } from "./settings/routes.js";

import { body, param, query } from "express-validator";
import client from "./controllers/client.js";

export const router = (app) => {
  // System.
  app.get(routes.system, system.info);
  app.post(routes.googleDrive, googleDrive.upload);

  // Register.
  app.post(
    routes.register,
    [
      body("username").notEmpty().trim(),
      body("email").isEmail().trim(),
      body("firstName").notEmpty().trim(),
      body("lastName").notEmpty().trim(),
      body("password").notEmpty().trim(),
    ],
    auth.register
  );

  // Login.
  app.post(
    routes.login,
    [
      body("user").isLength({ min: 2, max: 50 }),
      body("password").isStrongPassword({ minSymbols: 0 }),
    ],
    auth.login
  );

  // Users.
  app.get(routes.user, user.list);
  app.get(`${routes.user}/:id`, [param("id").exists().isUUID()], user.show); // TODO Is it active?

  // File storage.
  app.put(
    `${routes.fileStorage}/:target`,
    param("target").notEmpty(),
    fileStorage.update
  );

  app.get(
    `${routes.fileStorage}/:target`,
    param("target").notEmpty(),
    fileStorage.show
  );

  // Tags.
  app.delete(`${routes.tag}/:id`, param("id").notEmpty().isUUID(), tag.destroy);
  app.get(routes.tag, tag.list);
  app.get(`${routes.tag}/:id`, param("id").notEmpty().isUUID(), tag.show);
  app.post(routes.tag, tag.create);

  // Translations.
  app.get(
    routes.translation,
    query("wordId").notEmpty().isUUID(),
    translation.list
  );

  app.post(
    routes.translation,
    query("wordId").notEmpty().isUUID(),
    translation.create
  );

  // Clients.
  app.post(routes.client, body("name").notEmpty(), client.create);

  app.get(routes.client, client.list);

  app.get(`${routes.client}/:id`, param("id").notEmpty().isUUID(), client.show);

  app.put(
    `${routes.client}/:id`,
    param("id").notEmpty().isUUID(),
    client.update
  );

  app.patch(
    `${routes.client}/:id`,
    param("id").notEmpty().isUUID(),
    client.archive
  );

  app.delete(
    `${routes.client}/:id`,
    param("id").notEmpty().isUUID(),
    client.destroy
  );

  // Words.
  app.post(routes.word, word.create);

  app.get(routes.word, word.list);

  app.get(`${routes.word}/:id`, param("id").notEmpty().isUUID(), word.show);

  app.put(`${routes.word}/:id`, param("id").notEmpty().isUUID(), word.update);

  app.post(
    `${routes.word}/:wordId/updateTags`,
    param("wordId").notEmpty().isUUID(),
    word.updateTags
  );

  app.delete(
    `${routes.word}/:id`,
    param("id").notEmpty().isUUID(),
    word.destroy
  );
};
