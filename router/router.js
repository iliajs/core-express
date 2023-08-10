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
import { hi } from "../controllers/hi.js";
import { body, query } from "express-validator";
import { upload } from "../controllers/googleDrive.js";

export const router = (app) => {
  app.get(routes.hi, hi);
  app.post(routes.googleDrive, upload);

  app.get(routes.credentials, getCredentials);
  app.post(routes.credentials, body("data").notEmpty(), saveCredentials);

  app.post(routes.words, createWord);
  app.post(routes.words, createWord);
  app.post(`${routes.words}/:id`, updateWord);
  app.delete(`${routes.words}/:id`, destroyWord);
  app.get(routes.words, listWord);
  app.get(`${routes.words}/:id`, showWord);

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
