import "dotenv/config";
import express from "express";

import "./db/models/index.js";
import { sequelizeOperation } from "./db/sequelize.js";
import { router } from "./router/router.js";

import { TelegramProcessing } from "./classes/TelegramProcessing.js";

import {
  TELEGRAM_UPDATE_INTERVAL,
  TELEGRAM_UPDATE_METHODS,
  UI_FILE_PATH,
} from "./settings/index.js";
import { ROUTES_WITHOUT_AUTHORIZATION } from "./settings/routes.js";
import { serverPort } from "./settings/port.js";
import { showServerInfo } from "./helpers/logs.js";

await sequelizeOperation.connect();

const app = express();

// Express configuration.
app.use(express.static("public")); // Use the express-static middleware.
app.use(express.static(UI_FILE_PATH));
app.use(express.json()); // To support JSON-encoded bodies.
app.use(express.urlencoded()); // To support URL-encoded bodies.

app.use(async function (request, response, next) {
  // Because Chrome doesn't support CORS for connections from localhost we need this for local development.
  // TODO Check that in heroku config it's false.
  if (process.env.ALLOW_ORIGIN_ALL === "true") {
    response.header("Access-Control-Allow-Origin", "*");
    response.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    response.header(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, DELETE"
    );
  }

  if (request.method === "OPTIONS") {
    return next();
  }

  if (!ROUTES_WITHOUT_AUTHORIZATION.includes(request.url)) {
    console.log("no");
    // TODO Send 403? status when token is not presented or incorrect
    // if (!request.headers['authorization']) {
    //   // TODO Enable authorization check for production.
    //   // TODO Not it's disabled. To enable uncomment next line and remove 'return next()' line after next one.
    //   // console.error('Auth error #1: try to access private route without access token.')
    //   // console.log("Requested url: ", request.url)
    //   // response.status(403).json({error: 'token_not_presented'});
    //   console.log('no1')
    //   return next()
    // }
    return next();
    // TODO Enable authorization check for production.
    // TODO Not it's disabled. To enable uncomment next line and remove 'return next()' line after next one.

    // const authToken = request.headers['authorization']?.split(" ")[1];
    // const modelUser = new UserModel();
    // const find = await modelUser.findByToken(authToken)
    // if (!find) {
    //   response.status(403).json({error: 'token_invalid'});
    // } else {
    //   return next();
    // }
  } else {
    console.log();
    return next();
  }
});

app.listen(serverPort, () => showServerInfo());
router(app);

// Process telegram updates with long-polling.
if (
  process.env.TELEGRAM_UPDATE_METHOD === TELEGRAM_UPDATE_METHODS.longPolling
) {
  const telegramProcessing = new TelegramProcessing();
  await telegramProcessing.process();
  setInterval(
    async () => await telegramProcessing.process(),
    TELEGRAM_UPDATE_INTERVAL
  );
}
