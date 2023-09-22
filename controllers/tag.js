import { Word } from "../db/models/Word.js";
import { generateErrorText, sendError } from "../helpers/api.js";
import { Tag } from "../db/models/Tag.js";
import lang from "../lang.js";

const create = async (request, response) => {
  try {
    const { name } = request.body;
    const [data, isCreated] = await Tag.findOrCreate({
      where: { name },
    });
    isCreated
      ? response.send({ success: true, data })
      : response.status(409).send({ errorText: lang.duplicateIsFound });
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
    const data = await Tag.findByPk(id);
    if (data) {
      await Tag.destroy({
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
      errorText: generateErrorText("delete", "tag"),
      error,
      response,
    });
  }
};

const list = async (request, response) => {
  try {
    const data = await Tag.findAll({ include: Word });
    response.send({ success: true, data });
  } catch (error) {
    sendError({
      errorText: generateErrorText("list", "tags"),
      error,
      response,
    });
  }
};

export default { create, destroy, list };
