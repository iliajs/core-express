import { Category } from "../db/models/category.js";
import { getErrorText, throwAndSendError } from "../helpers/api.js";

export const create = async (request, response) => {
  try {
    const { title } = request.body;
    const data = await Category.create({ title });
    response.send({ success: true, data });
  } catch (error) {
    throwAndSendError({
      httpStatus: 500,
      errorText: getErrorText("create", "category"),
      error,
      response,
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
  } catch (error) {
    throwAndSendError({
      httpStatus: 500,
      errorText: getErrorText("delete", "category"),
      error,
      response,
    });
  }
};

export const list = async (request, response) => {
  try {
    const data = await Category.findAll();
    response.send({ success: true, data });
  } catch (error) {
    throwAndSendError({
      httpStatus: 500,
      errorText: getErrorText("list", "categories"),
      error,
      response,
    });
  }
};
