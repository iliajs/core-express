import { generateErrorText, sendHttp500 } from "../helpers/api.js";
import { validationResult } from "express-validator";
import { notifySources } from "../settings/notify.js";
import { TelegramApi } from "../api/TelegramApi.js";

import Mailjet from "node-mailjet";

const send = async (request, response) => {
  const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
  );

  const maijetRequest = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "registration@self-platform.es",
          Name: "Self-Platform.es",
        },
        To: [
          {
            Email: "iadomyshev@gmail.com",
          },
        ],
        Subject: "Confirm Your Email",
        HTMLPart:
          "<h4>Dear customer!</h4>" +
          'We are really happy that you are registered in our application <a href="http://self-platform.es">Self-Platform.es</a>' +
          '<br/><br/>Please, confirm your email by clicking on <a href="http://self-platform.es/confirm-email/">this link</a>' +
          "<br /><br/>Thanks a lot and hope see you soon!",
      },
    ],
  });

  maijetRequest
    .then(() => {
      response.status(200).json({ success: true });
    })
    .catch((err) => {
      response.status(500).json({ error: true });
    });

  // try {
  //   const validator = validationResult(request);
  //   if (!validator.isEmpty()) {
  //     return response.status(422).json({ errors: validator.array() });
  //   }
  //
  //   // TODO This check should be in middleware.
  //   if (request.body.token !== process.env.SITE_TOKEN) {
  //     response.sendStatus(401);
  //   }
  //
  //   const notifyConfig = notifySources[request.body.sourceId];
  //
  //   console.log("notify", notifyConfig);
  //
  //   const telegram = new TelegramApi();
  //   await telegram.sendMessage(
  //     notifyConfig.telegramUserId,
  //     request.body.message
  //   );
  //
  //   response.send({ success: true });
  // } catch (error) {
  //   sendHttp500({
  //     errorText: generateErrorText("notify", "process"),
  //     error,
  //     response,
  //   });
  // }
};

export default { send };
