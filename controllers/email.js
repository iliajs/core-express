import { prisma } from "../app.js";
import { validationResult } from "express-validator";
import { generateErrorText, sendHttp500 } from "../helpers/api.js";

const confirm = async (request, response) => {
  console.log(request.body);

  try {
    const validator = validationResult(request);

    if (!validator.isEmpty()) {
      return response.status(422).json({ errors: validator.array() });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: request.body.email,
        authCode: request.body.code,
        active: false,
      },
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { active: true, authCode: null },
      });

      response.status(200).json({ success: true });
    } else {
      response.status(200).json({ success: false });
    }
  } catch (error) {
    sendHttp500({
      errorText: generateErrorText("confirm", "email"),
      error,
      response,
    });
  }
};

export default { confirm };
