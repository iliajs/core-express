import fs from "fs/promises";
import {
  CREDENTIALS_FILE,
  CREDENTIALS_FILE_NAME,
  ENCRYPTED_FILES_PATH,
} from "../settings/files.js";

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
