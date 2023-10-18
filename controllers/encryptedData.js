import { credentialRecordTypes } from "../settings/index.js";
import { validationResult } from "express-validator";
import { Op } from "sequelize";
import { addDays, format } from "date-fns";
import { prisma } from "../app.js";
import fs from "fs/promises";
import { CREDENTIALS_FILE_PATH } from "../settings/files.js";
import { generateErrorText, sendHttp500 } from "../helpers/api.js";

const get = async (request, response) => {
  try {
    const encryptedData = await fs.readFile(CREDENTIALS_FILE_PATH, "utf8");

    return response
      .status(200)
      .json({ encryptedData: encryptedData.replace(/\\/g, "") });
  } catch (error) {
    sendHttp500({
      errorText: generateErrorText("get", "encryptedRecord"),
      error,
      response,
    });
  }
};

const update = async (request, response) => {
  // fs.writeFile(CREDENTIALS_FILE_PATH, "This is awesome!", (err) => {
  //   console.log("A1", err);
  // });

  return response.status(200).json({ hello: "hello" });
};

const updateOld = async (request, response) => {
  const validator = validationResult(request);
  if (!validator.isEmpty()) {
    return response.status(403).json({ errors: validator.array() });
  }

  const { data } = request.body;
  let mainRecord = null;
  let yesterdayBackupCreated = false;

  // Update or create main record.
  try {
    mainRecord = await prisma.encryptedRecord.findFirst({
      where: {
        type: credentialRecordTypes.main,
      },
      raw: true,
    });

    console.log(1, mainRecord);

    if (!mainRecord) {
      await prisma.encryptedRecord.create({
        data,
        type: credentialRecordTypes.main,
      });

      return response.status(200).json({
        created: !mainRecord,
        updated: !!mainRecord,
        yesterdayBackupCreated,
      });
    } else {
      await prisma.encryptedRecord.update(
        { data },
        {
          where: {
            type: credentialRecordTypes.main,
          },
        }
      );
    }
  } catch (e) {
    console.error(e);
    return response.status(500).json({
      error: "Cannot create or update main record.",
    });
  }

  // Create backup.
  if (mainRecord) {
    const yesterday = addDays(new Date(), -1);
    const yesterdayStart = format(yesterday, "yyyy-MM-dd 00:00");
    const yesterdayEnd = format(yesterday, "yyyy-MM-dd 23:59");

    const yesterdayBackup = await prisma.encryptedRecord.findFirst({
      where: {
        createdAt: {
          [Op.between]: [yesterdayStart, yesterdayEnd],
        },
        type: credentialRecordTypes.backup,
      },
    });

    if (!yesterdayBackup) {
      delete mainRecord.id;
      mainRecord.type = credentialRecordTypes.backup;
      mainRecord.createdAt = yesterdayStart;
      yesterdayBackupCreated = !!(await prisma.encryptedRecord.create(
        mainRecord
      ));
    }
  }

  return response.status(200).json({
    updated: !!mainRecord,
    created: !mainRecord,
    yesterdayBackupCreated,
  });
};

export default { get, update };
