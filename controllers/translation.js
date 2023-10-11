import { generateErrorText, sendError } from "../helpers/api.js";
import { validationResult } from "express-validator";
import { auth, prisma } from "../app.js";

const list = async (request, response) => {
  try {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      return response.send({ errors: validator.array() });
    }

    const { wordId } = request.query;

    const word = await prisma.word.findFirst({ where: { id: wordId } });

    if (!word) {
      return response.sendStatus(404);
    }

    const data = await prisma.translation.findMany({
      where: {
        wordId: wordId,
      },
      include: { word: true },
    });

    response.send({ success: true, data });
  } catch (error) {
    return sendError({
      errorText: generateErrorText("list", "translations"),
      error,
      response,
    });
  }
};

const create = async (request, response) => {
  try {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      return response.send({ errors: validator.array() });
    }

    const { wordId } = request.query;
    let { text } = request.body;

    const word = await prisma.word.findFirst({ where: { id: wordId } });
    if (!word) {
      return response.sendStatus(404);
    }

    const data = await prisma.translation.create({
      data: { text, wordId, userId: auth.user.id },
    });

    response.send({ success: true, data });
  } catch (error) {
    sendError({
      errorText: generateErrorText("create", "translation"),
      error,
      response,
    });
  }
};

export default { list, create };
