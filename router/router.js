import {
  create as createWord,
  update as updateWord,
  destroy as destroyWord,
  list as listWord,
  show as showWord,
} from "../controllers/wordController.js";
import { list as listTranslation } from "../controllers/translationController.js";
import { ROUTES } from "../settings/routes.js";
import { hi } from "../controllers/hi.js";
import { query } from "express-validator";

export const router = (app) => {
  app.get(ROUTES.HI, hi);
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
};
