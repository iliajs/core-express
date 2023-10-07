import { Word } from "../db/models/Word.js";
import { generateErrorText, sendError } from "../helpers/api.js";
import { Op } from "sequelize";
import lang from "../lang.js";
import { WordAndTag } from "../db/models/WordAndTag.js";
import { auth, prisma } from "../app.js";
import { validationResult } from "express-validator";

const create = async (request, response) => {
  try {
    const { title } = request.body;

    const existentWord = await prisma.word.findFirst({
      where: { title, userId: auth.user.id },
    });

    if (existentWord) {
      return await response.sendStatus(409);
    }

    const word = await prisma.word.create({
      data: { title, userId: auth.user.id },
    });

    response.send({ success: true, word });
  } catch (error) {
    sendError({
      errorText: generateErrorText("create", "word"),
      error,
      response,
    });
  }
};

const destroy = async (request, response) => {
  try {
    const { id } = request.params;

    const data = await prisma.word.findFirst({
      where: { id, userId: auth.user.id },
    });

    if (data) {
      await prisma.word.delete({
        where: {
          id,
          userId: auth.user.id,
        },
      });
      response.send(lang.deleted);
    } else {
      response.sendStatus(404);
    }
  } catch (error) {
    response.sendStatus(500);
  }
};

const list = async (request, response) => {
  try {
    const data = await prisma.word.findMany({
      where: { userId: auth.user.id },
      include: { translations: true, tags: true },
    });
    response.json(data);
  } catch (error) {
    response.sendStatus(500);
  }
};

const show = async (request, response) => {
  const validator = validationResult(request);
  if (!validator.isEmpty()) {
    return response.send({ errors: validator.array() });
  }

  try {
    const { id } = request.params;

    const data = await prisma.word.findFirst({
      where: { id, userId: auth.user.id },
      include: { tags: true },
    });

    if (!data) {
      return response.sendStatus(404);
    }

    response.json(data);
  } catch (error) {
    response.sendStatus(500);
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
      return response.sendStatus(409);
    }

    await Word.update({ title }, { where: { id } });
    response.send({ success: true });
  } catch (error) {
    sendError({
      errorText: generateErrorText("update", "word"),
      error,
      response,
    });
  }
};

const updateTags = async (request, response) => {
  const { wordId } = request.params;
  const { tags } = request.body;

  try {
    await WordAndTag.destroy({ where: { wordId } });

    tags.forEach((tagId) => {
      WordAndTag.create({ tagId, wordId });
    });

    response.status(200).send({ updated: true });
  } catch (error) {
    sendError({
      errorText: generateErrorText("updateTags", "word"),
      error,
      response,
    });
  }
};

export default { destroy, create, list, show, update, updateTags };
