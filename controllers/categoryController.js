import { Category } from "../db/models/category.js";

export const create = async (req, response) => {
  try {
    const { title } = req.body;
    await Category.create({ title });
    response.send({ success: true });
  } catch (e) {
    console.error("Error create category; error: ", e);
    response.send({
      error: true,
      errorText: "Error create category;",
    });
  }
};
