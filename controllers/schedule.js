import { validationResult } from "express-validator";
import fs from "fs/promises";
import { SCHEDULE_FILES_PATH } from "../settings/files.js";
import { generateErrorText, sendHttp500 } from "../helpers/api.js";
import { auth } from "../app.js";

const show = async (request, response) => {
  try {
    const file = `${SCHEDULE_FILES_PATH}/${auth.user.id}`;

    const data = await fs.readFile(file, "utf8");

    return response.status(200).json(JSON.parse(data));
  } catch (error) {
    sendHttp500({
      errorText: generateErrorText("get", "schedule"),
      error,
      response,
    });
  }
};

const update = async (request, response) => {
  const validator = validationResult(request);

  try {
    if (!validator.isEmpty()) {
      return response.status(403).json({ errors: validator.array() });
    }

    const payload = request.body;
    const file = `${SCHEDULE_FILES_PATH}/${auth.user.id}`;

    await fs.writeFile(file, JSON.stringify(payload), { flag: "w" });

    return response.sendStatus(200);
  } catch (error) {
    return sendHttp500({
      errorText: generateErrorText("update", "schedule"),
      error,
      response,
    });
  }
};

export default { show, update };
