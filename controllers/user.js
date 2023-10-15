import { prisma } from "../app.js";
import { generateErrorText, sendHttp500 } from "../helpers/api.js";

const list = async (request, response) => {
  try {
    const data = (await prisma.user.findMany()).map((item) => {
      delete item.hash;
      return item;
    });

    return response.status(200).json({ success: true, data });
  } catch (error) {
    sendHttp500({
      errorText: generateErrorText("list", "user"),
      error,
      response,
    });
  }
};

const show = async (request, response) => {
  try {
    const { id } = request.params;

    const user = await prisma.user.findFirst({ where: { id } });

    if (!user) {
      return response.sendStatus(404);
    }

    return response.status(200).json(user);
  } catch (error) {
    sendHttp500({
      errorText: generateErrorText("show", "user"),
      error,
      response,
    });
  }
};

export default { list, show };
