export const fileStorageConfig = {
  schedule: { name: "schedule", parseJson: true },
  credentials: { name: "credentials", prepareEncryptedData: true },
  credentialsV2: { name: "credentialsV2", prepareEncryptedData: true },
};

export const fileStoragePath = "./fileStorage";
