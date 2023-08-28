import { Word } from "../db/models/Word.js";
import { unknownErrorText, sendError } from "../helpers/api.js";
import { Op } from "sequelize";
import lang from "../lang.js";
import { Translation } from "../db/models/Translation.js";

const list = async (request, response) => {
  try {
    const data = await Word.findAll({ include: Translation });
    response.send({ success: true, data });
  } catch (error) {
    sendError({
      errorText: unknownErrorText("list", "categories"),
      error,
      response,
    });
  }
};

const show = async (request, response) => {
  try {
    const { id } = request.params;
    const data = await Word.findByPk(id);
    data ? response.send({ success: true, data }) : response.sendStatus(404);
  } catch (error) {
    sendError({
      errorText: unknownErrorText("show", "word"),
      error,
      response,
    });
  }
};

const create = async (request, response) => {
  try {
    const { title } = request.body;
    const [data, isCreated] = await Word.findOrCreate({
      where: { title },
    });
    isCreated
      ? response.send({ success: true, data })
      : response.status(409).send({ errorText: lang.duplicateIsFound });
  } catch (error) {
    sendError({
      errorText: unknownErrorText("create", "word"),
      error,
      response,
    });
  }
};

const update = async (request, response) => {
  try {
    const { id } = request.params;
    const { title } = request.body;

    if (!(await Word.findByPk(id))) {
      return response.sendStatus(404);
    }

    if (
      await Word.findOne({
        where: {
          title,
          id: { [Op.ne]: id },
        },
      })
    ) {
      return response.status(409).send({ errorText: lang.duplicateIsFound });
    }

    await Word.update({ title }, { where: { id } });
    response.send({ success: true });
  } catch (error) {
    sendError({
      errorText: unknownErrorText("update", "word"),
      error,
      response,
    });
  }
};

const destroy = async (request, response) => {
  try {
    const { id } = request.params;
    const data = await Word.findByPk(id);
    if (data) {
      await Word.destroy({
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
      errorText: unknownErrorText("delete", "word"),
      error,
      response,
    });
  }
};

export default { list, show, create, update, destroy };