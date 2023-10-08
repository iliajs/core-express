import { generateErrorText, sendError } from "../helpers/api.js";
import { auth, prisma } from "../app.js";
import lang from "../lang.js";
import { validationResult } from "express-validator";

const create = async (request, response) => {
  try {
    const { name } = request.body;

    const existentTag = await prisma.tag.findFirst({
      where: { name, userId: auth.user.id },
    });

    if (existentTag) {
      return await response.sendStatus(409);
    }

    const data = await prisma.tag.create({
      data: { name, userId: auth.user.id },
    });

    return response.send({ success: true, data });
  } catch (error) {
    sendError({
      errorText: generateErrorText("create", "tag"),
      error,
      response,
    });
  }
};

const destroy = async (request, response) => {
  try {
    const { id } = request.params;

    const data = await prisma.tag.findFirst({
      where: { id, userId: auth.user.id },
    });

    if (data) {
      await prisma.tag.delete({
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
    const data = await prisma.tag.findMany({
      where: { userId: auth.user.id },
      //include: { words: true },
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

    const data = await prisma.tag.findFirst({
      where: { id, userId: auth.user.id },
      include: { words: true },
    });

    if (!data) {
      return response.sendStatus(404);
    }

    response.json(data);
  } catch (error) {
    response.sendStatus(500);
  }
};

export default { create, destroy, list, show };
