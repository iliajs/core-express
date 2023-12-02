export const fileStorageConfig = {
  schedule: { name: "schedule", returnJson: true },
  credentials: { name: "credentials" },
};

export const fileStoragePath = "./fileStorage";

export const ENCRYPTED_FILES_PATH = "./fileStorage/credentials";
export const CREDENTIALS_FILE_NAME = "credentials.aes";
export const CREDENTIALS_FILE = `${ENCRYPTED_FILES_PATH}/${CREDENTIALS_FILE_NAME}`;
