import { generateErrorText, sendHttp500 } from "../helpers/api.js";
import lang from "../lang.js";
import { auth, prisma } from "../app.js";
import { validationResult } from "express-validator";

const createOrUpdate = async (request, response) => {
  try {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      return response.status(422).json({ errors: validator.array() });
    }

    let timeSlot = null;
    const { id } = request.params;

    if (id) {
      timeSlot = await prisma.timeSlot.findFirst({ where: { id } });
    }

    if (id && !timeSlot) {
      return response.sendStatus(404);
    }

    const { clientId } = request.query;

    const { date, time, comment } = request.body;

    const client = await prisma.client.findFirst({ where: { id: clientId } });

    if (!client) {
      return response.status(422).send("Client with this id is not found.");
    }

    let result;

    if (!timeSlot) {
      result = await prisma.timeSlot.create({
        data: { clientId, date, time, comment, userId: auth.user.id },
      });
    } else {
      result = await prisma.timeSlot.update({
        where: { id, userId: auth.user.id },
        data: { clientId, date, time, comment },
      });
    }

    response.send({ success: true, data: result });
  } catch (error) {
    sendHttp500({
      errorText: generateErrorText("create", "timeSlot"),
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

    const data = await prisma.timeSlot.findMany({
      where: { userId: auth.user.id },
      orderBy: [{ date: "asc" }, { time: "asc" }],
      include: { client: true },
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

const destroy = async (request, response) => {
  try {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      return response.status(422).json({ errors: validator.array() });
    }

    const { id } = request.params;

    const data = await prisma.timeSlot.findFirst({
      where: { id, userId: auth.user.id },
    });

    if (data) {
      await prisma.timeSlot.delete({
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
      errorText: generateErrorText("destroy", "timeSlot"),
      error,
      response,
    });
  }
};

export default { createOrUpdate, list, destroy };
