import { credentialModel } from "../db/models/credentialModel.js";
import { credentialRecordTypes } from "../settings/index.js";
import { validationResult } from "express-validator";
import { Op } from "sequelize";
import { addDays, format } from "date-fns";

export const save = async (request, response) => {
  const validator = validationResult(request);
  if (!validator.isEmpty()) {
    return response.status(403).json({ errors: validator.array() });
  }

  const yesterday = addDays(new Date(), -1);
  const yesterdayStart = format(yesterday, "yyyy-MM-dd 00:00");
  const yesterdayEnd = format(yesterday, "yyyy-MM-dd 23:59");

  try {
    const yesterdayBackup = await credentialModel.findOne({
      where: {
        createdAt: {
          [Op.between]: [yesterdayStart, yesterdayEnd],
        },
        type: {
          [Op.not]: credentialRecordTypes.main,
        },
      },
    });

    let isBackupCreated = false;

    if (!yesterdayBackup) {
      const main = await credentialModel.findOne({
        where: {
          type: credentialRecordTypes.main,
        },
        raw: true,
      });

      delete main.id;
      main.type = credentialRecordTypes.backup;

      if (main) {
        await credentialModel.create(main);
        isBackupCreated = true;
      }
    }

    return response.status(200).json({ success: true, isBackupCreated });
  } catch (e) {
    response
      .status(500)
      .json({ errorText: "Error when try to check/create backup" });
  }

  const { data } = request.body;

  try {
    await credentialModel.update(
      {
        data,
      },
      {
        where: {
          type: credentialRecordTypes.main,
        },
      }
    );

    response.status(200).json({ success: true });
  } catch (e) {
    response
      .status(500)
      .json({ errorText: "Error when try to save credential" });
  }
};
