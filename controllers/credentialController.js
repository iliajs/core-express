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
  const yesterdayFrom = format(yesterday, "yyyy-MM-dd 00:00");
  const yesterdayTo = format(yesterday, "yyyy-MM-dd 23:59");

  try {
    const backup = await credentialModel.findOne({
      where: {
        createdAt: {
          [Op.between]: [yesterdayFrom, yesterdayTo],
        },
        type: {
          [Op.not]: credentialRecordTypes.main,
        },
      },
    });

    console.log(3, backup);

    if (!backup) {
      const main = await credentialModel.findOne({
        where: {
          type: credentialRecordTypes.main,
        },
        raw: true,
      });

      delete main.id;
      main.type = credentialRecordTypes.backup;

      console.log(4, main);

      if (main) {
        const createBackup = await credentialModel.create(main);
        console.log(5, createBackup);
      }
    }
    console.log(1, yesterdayFrom);
    console.log(2, yesterdayTo);
    return response.status(200).json({ success: true });
  } catch (e) {
    console.error("my own error", e);
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
    response.status(500).json({ error: "Error when save credential" });
  }
};
