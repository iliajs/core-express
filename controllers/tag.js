import { Word } from "../db/models/Word.js";
import { generateErrorText, sendError } from "../helpers/api.js";
import { Tag } from "../db/models/Tag.js";

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

export default { list };
