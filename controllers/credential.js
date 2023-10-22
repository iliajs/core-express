import { validationResult } from "express-validator";
import { format } from "date-fns";
import fs from "fs/promises";
import { CREDENTIALS_FILE } from "../settings/files.js";
import { generateErrorText, sendHttp500 } from "../helpers/api.js";
import { createCredentialFileBackupIfNotExist } from "../helpers/controllers.js";

const show = async (request, response) => {
  try {
    const encryptedData = await fs.readFile(CREDENTIALS_FILE, "utf8");

    return response.status(200).json(encryptedData.replace(/\\/g, ""));
  } catch (error) {
    sendHttp500({
      errorText: generateErrorText("get", "credential"),
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

    const { data } = request.body;

    const today = format(new Date(), "yyyyMMdd");
    await createCredentialFileBackupIfNotExist(today);

    await fs.writeFile(CREDENTIALS_FILE, data);

    return response.sendStatus(200);
  } catch (error) {
    sendHttp500({
      errorText: generateErrorText("update", "credential"),
      error,
      response,
    });
  }
};

export default { show, update };
