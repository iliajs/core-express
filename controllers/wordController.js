import { wordModel } from "../db/models/wordModel.js";
import { getSimpleErrorText, sendError } from "../helpers/api.js";
import { Op } from "sequelize";
import lang from "../lang.js";

export const create = async (request, response) => {
  try {
    const { title } = request.body;
    const [data, isCreated] = await wordModel.findOrCreate({
      where: { title },
    });
    isCreated
      ? response.send({ success: true, data })
      : response.status(409).send({ errorText: lang.duplicateIsFound });
  } catch (error) {
    sendError({
      httpStatus: 500,
      errorText: getSimpleErrorText("create", "word"),
      error,
      response,
    });
  }
};

export const update = async (request, response) => {
  try {
    const { id } = request.params;
    const { title } = request.body;

    if (!(await wordModel.findByPk(id))) {
      return response.sendStatus(404);
    }

    if (
      await wordModel.findOne({
        where: {
          title,
          id: { [Op.ne]: id },
        },
      })
    ) {
      return response.status(409).send({ errorText: lang.duplicateIsFound });
    }

    await wordModel.update({ title }, { where: { id } });
    response.send({ success: true });
  } catch (error) {
    sendError({
      httpStatus: 500,
      errorText: getSimpleErrorText("update", "word"),
      error,
      response,
    });
  }
};

export const destroy = async (request, response) => {
  try {
    const { id } = request.params;
    const data = await wordModel.findByPk(id);
    if (data) {
      await wordModel.destroy({
        where: {
          id,
        },
      });
      response.send({ success: true });
    } else {
      response.sendStatus(404);
    }
  } catch (error) {
    sendError({
      httpStatus: 500,
      errorText: getSimpleErrorText("delete", "word"),
      error,
      response,
    });
  }
};

export const list = async (request, response) => {
  try {
    const data = await wordModel.findAll();
    response.send({ success: true, data });
  } catch (error) {
    sendError({
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
    const data = await wordModel.findByPk(id);
    data ? response.send({ success: true, data }) : response.sendStatus(404);
  } catch (error) {
    sendError({
      httpStatus: 500,
      errorText: getSimpleErrorText("show", "word"),
      error,
      response,
    });
  }
};
