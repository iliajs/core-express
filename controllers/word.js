import { Word } from "../db/models/Word.js";
import { generateErrorText, sendError } from "../helpers/api.js";
import { Op } from "sequelize";
import lang from "../lang.js";
import { WordAndTag } from "../db/models/WordAndTag.js";
import { prisma } from "../app.js";

const create = async (request, response) => {
  try {
    const { title } = request.body;
    const exist = await prisma.words.findFirst({ where: { title } });
    console.log(exist);

    if (exist) {
      return await response
        .status(409)
        .send({ errorText: lang.duplicateIsFound });
    }

    const word = await prisma.words.create({
      data: { title },
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
    const data = await prisma.words.findFirst({ where: { id } });
    if (data) {
      await prisma.words.delete({
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
      errorText: generateErrorText("delete", "word"),
      error,
      response,
    });
  }
};

const list = async (request, response) => {
  try {
    const data = await prisma.words.findMany({
      include: { translations: true, wordsAndTags: true },
    });
    response.send({ success: true, data });
  } catch (error) {
    sendError({
      errorText: generateErrorText("list", "categories"),
      error,
      response,
    });
  }
};

const show = async (request, response) => {
  try {
    const { id } = request.params;
    console.log("id", id);
    const data = await Word.findByPk(`${id}`);
    console.log(data);
    data ? response.send({ success: true, data }) : response.sendStatus(404);
  } catch (error) {
    sendError({
      errorText: generateErrorText("show", "word"),
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
