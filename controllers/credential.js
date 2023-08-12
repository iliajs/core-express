import { Credential } from "../db/models/Credential.js";
import { credentialRecordTypes } from "../settings/index.js";
import { validationResult } from "express-validator";
import { Op } from "sequelize";
import { addDays, format } from "date-fns";

const get = async (request, response) => {
  const data = await Credential.findOne({
    where: {
      type: credentialRecordTypes.main,
    },
  });

  return response.status(200).json({ success: true, data });
};

const update = async (request, response) => {
  const validator = validationResult(request);
  if (!validator.isEmpty()) {
    return response.status(403).json({ errors: validator.array() });
  }

  const { data } = request.body;
  let mainRecord = null;
  let yesterdayBackupCreated = false;

  // Update or create main record.
  try {
    mainRecord = await Credential.findOne({
      where: {
        type: credentialRecordTypes.main,
      },
      raw: true,
    });

    console.log(1, mainRecord);

    if (!mainRecord) {
      await Credential.create({ data, type: credentialRecordTypes.main });

      return response.status(200).json({
        created: !mainRecord,
        updated: !!mainRecord,
        yesterdayBackupCreated,
      });
    } else {
      await Credential.update(
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

    const yesterdayBackup = await Credential.findOne({
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
      yesterdayBackupCreated = !!(await Credential.create(mainRecord));
    }
  }

  return response.status(200).json({
    updated: !!mainRecord,
    created: !mainRecord,
    yesterdayBackupCreated,
  });
};

export default { get, update };
