import fs from "fs/promises";
import { fileStorageConfig, fileStoragePath } from "../settings/fileStorage.js";
import { generateErrorText, sendHttp500 } from "../helpers/api.js";
import { auth } from "../app.js";
import { createFileStorageBackup } from "../helpers/fileStorage.js";

const show = async (request, response) => {
  const { target } = request.params;

  const path = `${fileStoragePath}/${target}`;

  const file = `${path}/${auth.user.id}`;

  try {
    const data = await fs.readFile(file, "utf8");

    const returnJson = fileStorageConfig?.[target]?.returnJson;

    return response.send(returnJson ? JSON.parse(data) : data);
  } catch (error) {
    if (error.errno === -2) {
      return response.sendStatus(200);
    }

    sendHttp500({
      errorText: generateErrorText("get", target),
      error,
      response,
    });
  }
};

const update = async (request, response) => {
  const { target } = request.params;

  const path = `${fileStoragePath}/${target}`;

  const file = `${path}/${auth.user.id}`;

  try {
    const payload = request.body;

    await createFileStorageBackup(target);

    const returnJson = fileStorageConfig?.[target]?.returnJson;

    await fs.writeFile(file, returnJson ? JSON.stringify(payload) : payload, {
      flag: "w",
    });

    return response.sendStatus(200);
  } catch (error) {
    return sendHttp500({
      errorText: generateErrorText("update", target),
      error,
      response,
    });
  }
};

export default { show, update };
