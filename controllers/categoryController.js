import { Category } from "../db/models/category.js";
import { getSimpleErrorText, throwAndSendError } from "../helpers/api.js";

export const create = async (request, response) => {
  try {
    const { title } = request.body;
    const [data, isCreated] = await Category.findOrCreate({
      where: { title },
    });
    isCreated
      ? response.send({ success: true, data })
      : response.status(409).send({ errorText: "Duplicate is found;" });
  } catch (error) {
    throwAndSendError({
      httpStatus: 500,
      errorText: getSimpleErrorText("create", "category"),
      error,
      response,
    });
  }
};

export const destroy = async (request, response) => {
  try {
    const { id } = request.params;
    const data = await Category.findByPk(id);
    if (data) {
      await Category.destroy({
        where: {
          id,
        },
      });
      response.send({ success: true });
    } else {
      response.sendStatus(404);
    }
  } catch (error) {
    throwAndSendError({
      httpStatus: 500,
      errorText: getSimpleErrorText("delete", "category"),
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
      errorText: getSimpleErrorText("list", "categories"),
      error,
      response,
    });
  }
};

export const show = async (request, response) => {
  try {
    const { id } = request.params;
    const data = await Category.findByPk(id);
    data ? response.send({ success: true, data }) : response.sendStatus(404);
  } catch (error) {
    throwAndSendError({
      httpStatus: 500,
      errorText: getSimpleErrorText("show", "category"),
      error,
      response,
    });
  }
};
