import { generateErrorText, sendHttp500 } from "../helpers/api.js";
import lang from "../lang.js";
import { auth, prisma } from "../app.js";
import { validationResult } from "express-validator";

const create = async (request, response) => {
  try {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      return response.status(422).json({ errors: validator.array() });
    }

    const name = request.body.name?.trim();

    const existentClient = await prisma.client.findFirst({
      where: { name, userId: auth.user.id },
    });

    if (existentClient) {
      return await response.sendStatus(409);
    }

    const data = await prisma.client.create({
      data: { name, userId: auth.user.id },
    });

    response.send({ success: true, data });
  } catch (error) {
    sendHttp500({
      errorText: generateErrorText("create", "client"),
      error,
      response,
    });
  }
};

const list = async (request, response) => {
  try {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      return response.status(422).json({ errors: validator.array() });
    }

    const data = await prisma.client.findMany({
      where: { userId: auth.user.id },
      orderBy: [{ name: "asc" }],
    });

    response.json(data);
  } catch (error) {
    sendHttp500({
      errorText: generateErrorText("list", "client"),
      error,
      response,
    });
  }
};

const show = async (request, response) => {
  try {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      return response.status(422).json({ errors: validator.array() });
    }

    const { id } = request.params;

    const data = await prisma.client.findFirst({
      where: { id, userId: auth.user.id },
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
      return response.status(422).json({ errors: validator.array() });
    }

    const { id } = request.params;
    const { name } = request.body;

    if (
      !(await prisma.client.findFirst({
        where: { id, userId: auth.user.id },
      }))
    ) {
      return response.sendStatus(404);
    }

    if (
      await prisma.client.findFirst({
        where: {
          name,
          NOT: { id },
        },
      })
    ) {
      return response.sendStatus(409);
    }

    await prisma.client.update({
      where: { id, userId: auth.user.id },
      data: { name, updatedAt: new Date() },
    });

    response.send({ success: true });
  } catch (error) {
    sendHttp500({
      errorText: generateErrorText("update", "client"),
      error,
      response,
    });
  }
};

const archive = async (request, response) => {
  try {
    const { id } = request.params;
    const { archived } = request.body;

    if (
      !(await prisma.client.findFirst({
        where: { id, userId: auth.user.id },
      }))
    ) {
      return response.sendStatus(404);
    }

    await prisma.client.update({
      where: { id, userId: auth.user.id },
      data: { archived: !!archived, updatedAt: new Date() },
    });

    response.send({ success: true });
  } catch (error) {
    sendHttp500({
      errorText: generateErrorText("archive", "client"),
      error,
      response,
    });
  }
};

const destroy = async (request, response) => {
  try {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      return response.status(422).json({ errors: validator.array() });
    }

    const { id } = request.params;

    const data = await prisma.client.findFirst({
      where: { id, userId: auth.user.id },
    });

    if (data) {
      await prisma.client.delete({
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
      errorText: generateErrorText("destroy", "client"),
      error,
      response,
    });
  }
};

export default { create, list, show, update, archive, destroy };
