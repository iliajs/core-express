import path from "path";

export const TOKEN_LENGTH = 30;
export const TOKEN_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const TELEGRAM_UPDATE_INTERVAL = 5000;
export const telegramUpdateMethods = {
  webhook: "webhook",
  longPolling: "long_polling",
};
export const TOKEN_TYPES = {
  oneTime: "one-time",
  permanent: "permanent",
};

export const UI_FILE_PATH = path.resolve("../client/dist");

export const credentialRecordTypes = {
  main: "main",
  backup: "backup",
};
