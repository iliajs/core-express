import fs from "fs/promises";
import {
  CREDENTIALS_FILE,
  CREDENTIALS_FILE_NAME,
  ENCRYPTED_FILES_PATH,
  SCHEDULE_BACKUPS_PATH,
  SCHEDULE_FILES_PATH,
} from "../settings/files.js";
import { format } from "date-fns";
import { auth } from "../app.js";

export const createCredentialFileBackupIfNotExist = async (suffix) => {
  const files = await fs.readdir(ENCRYPTED_FILES_PATH);

  const todayBackup = files.find((item) => item.endsWith(`-${suffix}`));

  if (!todayBackup) {
    await fs.copyFile(
      CREDENTIALS_FILE,
      `${ENCRYPTED_FILES_PATH}/${CREDENTIALS_FILE_NAME}-${suffix}`
    );
  }
};

export const createScheduleFileBackupIfNotExist = async () => {
  const file = `${SCHEDULE_FILES_PATH}/${auth.user.id}`;

  const today = format(new Date(), "yyyyMMdd");

  const files = await fs.readdir(SCHEDULE_BACKUPS_PATH);

  const todayBackup = files.find((item) => item.endsWith(`-${today}`));

  if (!todayBackup) {
    await fs.copyFile(
      file,
      `${SCHEDULE_BACKUPS_PATH}/${auth.user.id}-${today}`
    );
  }
};
