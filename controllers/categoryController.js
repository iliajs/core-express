import { Category } from "../db/models/category.js";

export const create = async (request, response) => {
  try {
    const { title } = request.body;
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

export const destroy = async (request, response) => {
  try {
    const { id } = request.query;
    await Category.destroy({
      where: {
        id,
      },
    });
    response.send({ success: true });
  } catch (e) {
    console.error("Error delete category; error: ", e);
    response.send({
      error: true,
      errorText: "Error delete category;",
    });
  }
};
