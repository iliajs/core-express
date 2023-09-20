import { Word } from "../db/models/Word.js";
import { generateErrorText, sendError } from "../helpers/api.js";
import { Tag } from "../db/models/Tag.js";
import lang from "../lang.js";

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

export default { list, create };
