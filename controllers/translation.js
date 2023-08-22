import { Word } from "../db/models/Word.js";
import { unknownErrorText, sendError } from "../helpers/api.js";
import { Translation } from "../db/models/Translation.js";
import { validationResult } from "express-validator";

const list = async (request, response) => {
  const validator = validationResult(request);
  if (!validator.isEmpty()) {
    return response.send({ errors: validator.array() });
  }

  const wordId = request.query.wordId;

  if (!(await Word.findByPk(wordId))) {
    return response
      .status(404)
      .send({ error: `Cannot find word with id=${wordId}` });
  }

  try {
    const data = await Translation.findAll({
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

const create = async (request, response) => {
  const validator = validationResult(request);
  if (!validator.isEmpty()) {
    return response.send({ errors: validator.array() });
  }

  const wordId = request.query.wordId;

  if (!(await Word.findByPk(wordId))) {
    return response
      .status(404)
      .send({ error: `Cannot find word with id=${wordId}` });
  }

  try {
    const text = request.body?.text.trim();
    const data = await Translation.create({ text, wordId });
    response.send({ success: true, data });
  } catch (error) {
    sendError({
      errorText: unknownErrorText("create", "translation"),
      error,
      response,
    });
  }
};

export default { list, create };
