import { wordModel } from "../db/models/wordModel.js";
import { unknownErrorText, sendError } from "../helpers/api.js";
import { Op } from "sequelize";
import lang from "../lang.js";
import { translationModel } from "../db/models/translationModel.js";
import { validationResult } from "express-validator";

export const create = async (request, response) => {
  const validator = validationResult(request);
  if (!validator.isEmpty()) {
    return response.send({ errors: validator.array() });
  }

  const wordId = request.query.wordId;

  if (!(await wordModel.findByPk(wordId))) {
    return response
      .status(404)
      .send({ error: `Cannot find word with id=${wordId}` });
  }

  try {
    const text = request.body?.text.trim();
    const data = await translationModel.create({ text, wordId });
    response.send({ success: true, data });
  } catch (error) {
    sendError({
      errorText: unknownErrorText("create", "translation"),
      error,
      response,
    });
  }
};

// TODO: It's from wordController, needed to be changed;
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
      errorText: unknownErrorText("update", "word"),
      error,
      response,
    });
  }
};

// TODO: It's from wordController, needed to be changed;
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
      errorText: unknownErrorText("delete", "word"),
      error,
      response,
    });
  }
};

export const list = async (request, response) => {
  const validator = validationResult(request);
  if (!validator.isEmpty()) {
    return response.send({ errors: validator.array() });
  }

  const wordId = request.query.wordId;

  if (!(await wordModel.findByPk(wordId))) {
    return response
      .status(404)
      .send({ error: `Cannot find word with id=${wordId}` });
  }

  try {
    const data = await translationModel.findAll({
      where: {
        wordId: wordId,
      },
    });

    response.send({ success: true, data });
  } catch (error) {
    return sendError({
      errorText: unknownErrorText("list", "translations"),
      error,
      response,
    });
  }
};

// TODO: It's from wordController, needed to be changed;
export const show = async (request, response) => {
  try {
    const { id } = request.params;
    const data = await wordModel.findByPk(id);
    data ? response.send({ success: true, data }) : response.sendStatus(404);
  } catch (error) {
    sendError({
      errorText: unknownErrorText("show", "word"),
      error,
      response,
    });
  }
};
