import { generateErrorText, sendHttp500 } from "../helpers/api.js";
import { validationResult } from "express-validator";
import { notifySources } from "../settings/notify.js";
import { TelegramApi } from "../api/TelegramApi.js";
import { auth, prisma } from "../app.js";

const run = async (request, response) => {
  try {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      return response.status(422).json({ errors: validator.array() });
    }

    const notificationToken = await prisma.notificationToken.findFirst({
      where: { id: request.body.token },
    });

    if (!notificationToken) {
      return response.sendStatus(404);
    }

    console.log("NOTIF TOKEN", notificationToken);

    // const notifyConfig = notifySources[request.body.sourceId];
    //
    const telegram = new TelegramApi();
    await telegram.sendMessage(
      notificationToken.telegramBotId,
      notificationToken.telegramUserId,
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
