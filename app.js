import "dotenv/config";

import { ExpressOperation } from "./classes/ExpressOperation.js";
import { PrismaClient } from "@prisma/client";
import { Authorization } from "./classes/Auth.js";
import {
  TELEGRAM_UPDATE_INTERVAL,
  telegramUpdateMethods,
} from "./settings/index.js";
import { TelegramProcessing } from "./classes/TelegramProcessing.js";

export const prisma = new PrismaClient();
export const auth = new Authorization();

// Express.
new ExpressOperation();

// TODO Re-implement telegram processing.
// Process telegram updates with long-polling.
if (process.env.TELEGRAM_UPDATE_METHOD === telegramUpdateMethods.longPolling) {
  const telegramProcessing = new TelegramProcessing();
  await telegramProcessing.process();
  setInterval(
    async () => await telegramProcessing.process(),
    TELEGRAM_UPDATE_INTERVAL
  );
}
