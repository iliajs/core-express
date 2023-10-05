import "dotenv/config";
import "./db/relations.js";
import { sequelizeOperation } from "./db/sequelize.js";
import { ExpressOperation } from "./classes/ExpressOperation.js";
import { PrismaClient } from "@prisma/client";
import { Authorization } from "./classes/Auth.js";

// Database.
await sequelizeOperation.connect();

export const prisma = new PrismaClient();
export const auth = new Authorization();

// Express.
new ExpressOperation();

// TODO Re-implement telegram processing.
// Process telegram updates with long-polling.
// if (process.env.TELEGRAM_UPDATE_METHOD === telegramUpdateMethods.longPolling) {
//   const telegramProcessing = new TelegramProcessing();
//   await telegramProcessing.process();
//   setInterval(
//     async () => await telegramProcessing.process(),
//     TELEGRAM_UPDATE_INTERVAL
//   );
// }
