import {
  create as createCategory,
  destroy as destroyCategory,
  list as listCategory,
  show as showCategory,
} from "../controllers/categoryController.js";
import { ROUTES } from "../settings/routes.js";
import { hi } from "../controllers/hi.js";

export const router = (app) => {
  app.get(ROUTES.HI, hi);
  app.post(ROUTES.CATEGORY, createCategory);
  app.delete(`${ROUTES.CATEGORY}/:id`, destroyCategory);
  app.get(ROUTES.CATEGORY, listCategory);
  app.get(`${ROUTES.CATEGORY}/:id`, showCategory);
};
