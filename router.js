import auth from "./controllers/auth.js";
import googleDrive from "./controllers/googleDrive.js";
import system from "./controllers/system.js";
import tag from "./controllers/tag.js";
import translation from "./controllers/translation.js";
import user from "./controllers/user.js";
import word from "./controllers/word.js";
import fileStorage from "./controllers/fileStorage.js";

import { routes } from "./settings/routes.js";

import { body, oneOf, param, query } from "express-validator";
import client from "./controllers/client.js";
import timeSlot from "./controllers/timeSlot.js";
import notify from "./controllers/notify.js";
import email from "./controllers/email.js";

export const router = (app) => {
  // System.
  app.get(routes.system, system.info);
  app.post(routes.googleDrive, googleDrive.upload);

  // Register.
  app.post(
    routes.register,
    [
      body("username").trim(), // TODO Improve .notEmpty(),
      body("email").trim().isEmail(),
      body("firstName").trim(), // TODO Improve .notEmpty(),
      body("lastName").trim(), // TODO Improve .notEmpty(),
      body("password").trim().isStrongPassword({ minSymbols: 0 }),
      body("token").isLength({ min: 1, max: 2048 }),
    ],
    auth.register
  );

  // Login.
  app.post(
    routes.login,
    [
      body("user").trim().isLength({ min: 2, max: 50 }),
      body("password").trim().isStrongPassword({ minSymbols: 0 }),
      body("token").isLength({ min: 1, max: 2048 }),
    ],
    auth.login
  );

  // Restore password.
  app.post(
    routes.restorePassword,
    [body("email").trim().isEmail()],
    body("token").isLength({ min: 1, max: 2048 }),
    auth.restorePassword
  );

  // Change password.
  app.post(
    routes.changePassword,
    [body("email").isEmail()],
    [body("rpCode").isUUID()],
    body("password").trim().isStrongPassword({ minSymbols: 0 }),
    body("token").isLength({ min: 1, max: 2048 }),
    auth.changePassword
  );

  // Auth user operations.
  app.get(routes.getAuthUser, auth.getAuthUser);
  app.put(
    routes.saveAuthUserConfig,
    [body("config").notEmpty().isJSON()],
    auth.saveAuthUserConfig
  );

  // Users.
  app.get(routes.user, user.list);
  // app.get(`${routes.user}/:id`, [param("id").exists().isUUID()], user.show); // TODO Is it actual?

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

  // Time slots.
  const timeSlotVerifyParams = [
    oneOf(
      [
        body("clientId").isUUID(),
        body("comment").trim().isLength({ min: 1, max: 500 }),
      ],
      { message: "At least one clientId or comment must be provided" }
    ),

    body("date").optional().isNumeric(),
    body("time").isLength({ min: 8, max: 8 }),
  ];

  app.post(routes.timeSlot, timeSlotVerifyParams, timeSlot.createOrUpdate);

  app.put(
    `${routes.timeSlot}/:id`,
    [param("id").isUUID(), ...timeSlotVerifyParams],
    timeSlot.createOrUpdate
  );

  app.get(routes.timeSlot, timeSlot.list);

  app.delete(
    `${routes.timeSlot}/:id`,
    param("id").notEmpty().isUUID(),
    timeSlot.destroy
  );

  // Emails.
  // TODO Only for testing now. That's why should be disabled.
  app.post(
    routes.confirmEmail,
    [body("email").isEmail(), body("regCode").isLength({ min: 6, max: 6 })],
    email.confirm
  );

  // Words.
  app.post(routes.word, word.create); // TODO Add validation.

  app.get(routes.word, word.list);

  app.get(`${routes.word}/:id`, param("id").notEmpty().isUUID(), word.show);

  app.put(`${routes.word}/:id`, param("id").notEmpty().isUUID(), word.update); // TODO Add body validation.

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

  // Notify.
  app.post(
    routes.notify,
    [
      body("token").isUUID(),
      body("sourceId").isLength({ min: 1, max: 32 }),
      body("recipientRole").isLength({ min: 1, max: 32 }),
      body("notifyType").isLength({ min: 1, max: 32 }),
      body("message").isLength({ min: 1, max: 4096 }),
    ],
    notify.run
  );
};
