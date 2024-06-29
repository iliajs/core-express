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
    let data = await fs.readFile(file, "utf8");

    const config = fileStorageConfig?.[target];

    if (config.parseJson) {
      data = JSON.parse(data);
    }

    if (config.prepareEncryptedData) {
      data = data.replace(/\\/g, "");
    }

    return response.send(data);
  } catch (error) {
    // File not exist case.
    if (error.errno === -2) {
      return response.status(200).json({ isEmptyData: true });
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
    let payload = request.body;

    await createFileStorageBackup(target);

    const config = fileStorageConfig?.[target];

    if (config.parseJson) {
      payload = JSON.stringify(payload);
    }

    if (config.prepareEncryptedData) {
      payload = payload.encryptedData;
    }

    await fs.writeFile(file, payload, {
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
