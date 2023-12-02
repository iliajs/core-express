import fs from "fs/promises";
import { fileStoragePath } from "../settings/fileStorage.js";
import { format } from "date-fns";
import { auth } from "../app.js";

export const createFileStorageBackup = async (target) => {
  const path = `${fileStoragePath}/${target}`;

  const file = `${path}/${auth.user.id}`;

  const backupPath = `${path}/backups`;

  const today = format(new Date(), "yyyyMMdd");

  const files = await fs.readdir(backupPath);

  const todayBackup = files.find((item) => item.endsWith(`-${today}`));

  if (!todayBackup) {
    await fs.copyFile(file, `${backupPath}/${auth.user.id}-${today}`);
  }
};
