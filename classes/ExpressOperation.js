import express from "express";
import { UI_FILE_PATH } from "../settings/index.js";
import { routesWithoutAuthorization } from "../settings/routes.js";
import { showServerInfo } from "../helpers/log.js";
import { router } from "../router.js";
import { auth } from "../app.js";
import { serverPort } from "../settings/system.js";
import _ from "lodash";

export class ExpressOperation {
  constructor() {
    const app = express();
    app.use(express.static("public")); // Use the express-static middleware.
    app.use(express.static(UI_FILE_PATH));
    app.use(express.json()); // To support JSON-encoded bodies.
    app.use(express.urlencoded()); // To support URL-encoded bodies.

    app.use(async function (request, response, next) {
      let corsWhitelist = process.env.CORS_WHITELIST.split("|").filter(
        (item) => !!item
      );

      corsWhitelist = _.uniq(corsWhitelist);

      if (corsWhitelist.includes(request.headers.origin)) {
        response.header("Access-Control-Allow-Origin", request.headers.origin);

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
