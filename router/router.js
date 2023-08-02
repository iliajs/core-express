import {
  create as createWord,
  update as updateWord,
  destroy as destroyWord,
  list as listWord,
  show as showWord,
} from "../controllers/wordController.js";

import { save as saveCredential } from "../controllers/credentialController.js";

import {
  list as listTranslation,
  create as createTranslation,
} from "../controllers/translationController.js";
import { ROUTES } from "../settings/routes.js";
import { hi } from "../controllers/hi.js";
import { body, query } from "express-validator";
import { upload } from "../controllers/googleDrive.js";

export const router = (app) => {
  app.get(ROUTES.HI, hi);
  app.post(ROUTES.GOOGLE_DRIVE, upload);

  app.post(ROUTES.CREDENTIAL, body("data").notEmpty(), saveCredential);

  app.post(ROUTES.WORD, createWord);
  app.post(ROUTES.WORD, createWord);
  app.post(`${ROUTES.WORD}/:id`, updateWord);
  app.delete(`${ROUTES.WORD}/:id`, destroyWord);
  app.get(ROUTES.WORD, listWord);
  app.get(`${ROUTES.WORD}/:id`, showWord);

  app.get(
    ROUTES.TRANSLATION,
    query("wordId").notEmpty().isNumeric(),
    listTranslation
  );

  app.post(
    ROUTES.TRANSLATION,
    query("wordId").notEmpty().isNumeric(),
    createTranslation
  );
};
