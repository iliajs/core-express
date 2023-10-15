import { generateErrorText, sendHttp500 } from "../helpers/api.js";
import lang from "../lang.js";
import { auth, prisma } from "../app.js";
import { validationResult } from "express-validator";

const create = async (request, response) => {
  try {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      return response.send({ errors: validator.array() });
    }

    const { title } = request.body;

    const existentWord = await prisma.word.findFirst({
      where: { title, userId: auth.user.id },
    });

    if (existentWord) {
      return await response.sendStatus(409);
    }

    const data = await prisma.word.create({
      data: { title, userId: auth.user.id },
    });

    response.send({ success: true, data });
  } catch (error) {
    sendHttp500({
      errorText: generateErrorText("create", "word"),
      error,
      response,
    });
  }
};

const destroy = async (request, response) => {
  try {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      return response.send({ errors: validator.array() });
    }

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
    sendHttp500({
      errorText: generateErrorText("destroy", "word"),
      error,
      response,
    });
  }
};

const list = async (request, response) => {
  try {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      return response.send({ errors: validator.array() });
    }

    const data = await prisma.word.findMany({
      where: { userId: auth.user.id },
      include: { translations: true, tags: { include: { tag: true } } },
    });

    response.json(
      data.map((item) => ({ ...item, tags: item.tags.map((el) => el.tag) }))
    );
  } catch (error) {
    sendHttp500({
      errorText: generateErrorText("list", "word"),
      error,
      response,
    });
  }
};

const show = async (request, response) => {
  try {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      return response.send({ errors: validator.array() });
    }

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
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      return response.send({ errors: validator.array() });
    }

    const { id } = request.params;
    const { title } = request.body;

    if (
      !(await prisma.word.findFirst({
        where: { id, userId: auth.user.id },
      }))
    ) {
      return response.sendStatus(404);
    }

    if (
      await prisma.word.findFirst({
        where: {
          title,
          NOT: { id },
        },
      })
    ) {
      return response.sendStatus(409);
    }

    await prisma.word.update({
      where: { id, userId: auth.user.id },
      data: { title },
    });

    response.send({ success: true });
  } catch (error) {
    sendHttp500({
      errorText: generateErrorText("update", "word"),
      error,
      response,
    });
  }
};

const updateTags = async (request, response) => {
  try {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      return response.send({ errors: validator.array() });
    }

    const { wordId } = request.params;
    const { tags } = request.body;

    const foundWord = await prisma.word.findFirst({
      where: { id: wordId, userId: auth.user.id },
    });

    if (!foundWord) {
      return response.sendStatus(404);
    }

    // TODO: If tagId not exists, then we delete all connections but cannot add anyone; It's a mistake;
    await prisma.tagsOnWords.deleteMany({ where: { wordId } });

    for (const tagId of tags) {
      await prisma.tagsOnWords.create({
        data: {
          word: {
            connect: { id: wordId },
          },

          tag: {
            connect: { id: tagId },
          },

          user: {
            connect: { id: auth.user.id },
          },
        },
        include: { word: true, tag: true },
      });
    }

    response.status(200).send({ updated: true });
  } catch (error) {
    switch (error.code) {
      case "P2002":
        return response.sendStatus(409);
      case "P2025":
        return response.sendStatus(404);
    }

    sendHttp500({
      errorText: generateErrorText("updateTags", "word"),
      error,
      response,
    });
  }
};

export default { create, destroy, list, show, update, updateTags };
