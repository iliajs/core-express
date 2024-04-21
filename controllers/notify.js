import { generateErrorText, sendHttp500 } from "../helpers/api.js";
import { validationResult } from "express-validator";
import { notifySources } from "../settings/notify.js";
import { TelegramApi } from "../api/TelegramApi.js";

const run = async (request, response) => {
  try {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      return response.status(422).json({ errors: validator.array() });
    }

    // TODO This check should be in middleware.
    if (request.body.token !== process.env.SITE_TOKEN) {
      response.sendStatus(401);
    }

    const notifyConfig = notifySources[request.body.sourceId];

    console.log("notify", notifyConfig);

    const telegram = new TelegramApi();
    await telegram.sendMessage(
      notifyConfig.telegramUserId,
      request.body.message
    );

    response.send({ success: true });
  } catch (error) {
    sendHttp500({
      errorText: generateErrorText("notify", "process"),
      error,
      response,
    });
  }
};

export default { run };
