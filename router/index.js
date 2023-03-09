import { create as createCategory } from "../controllers/categoryController.js";
import { ROUTES } from "../settings/routes.js";
import { hi } from "../controllers/hi.js";

export const router = (app) => {
  app.get(ROUTES.HI, hi);
  app.post(ROUTES.CATEGORY, createCategory);
};
