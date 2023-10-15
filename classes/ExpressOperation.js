import express from "express";
import { UI_FILE_PATH } from "../settings/index.js";
import { routesWithoutAuthorization } from "../settings/routes.js";
import { serverPort } from "../settings/port.js";
import { showServerInfo } from "../helpers/logs.js";
import { router } from "../router.js";
import { auth } from "../app.js";

export class ExpressOperation {
  constructor() {
    const app = express();
    app.use(express.static("public")); // Use the express-static middleware.
    app.use(express.static(UI_FILE_PATH));
    app.use(express.json()); // To support JSON-encoded bodies.
    app.use(express.urlencoded()); // To support URL-encoded bodies.

    app.use(async function (request, response, next) {
      // Because Chrome doesn't support CORS for connections from localhost we need this for local development.
      // TODO Check that in production it's false.
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

      if (routesWithoutAuthorization.includes(request.url)) {
        return next();
      } else {
        const user = await auth.getUserByAuthorizationHeader(
          request.headers["authorization"]
        );

        auth.setUser(user);

        if (!user) {
          return response.sendStatus(401);
        }

        return next();
      }
    });

    app.listen(serverPort, () => showServerInfo());
    router(app);
  }
}
