export const fileStorageConfig = {
  schedule: { name: "schedule", parseJson: true },
  credentials: { name: "credentials", prepareEncryptedData: true },
};

export const fileStoragePath = "./fileStorage";

export const ENCRYPTED_FILES_PATH = "./fileStorage/credentials";
export const CREDENTIALS_FILE_NAME = "credentials.aes";
export const CREDENTIALS_FILE = `${ENCRYPTED_FILES_PATH}/${CREDENTIALS_FILE_NAME}`;
