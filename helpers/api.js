export const generateErrorText = (actionName, objectName) => {
  return `Exception. Cannot ${actionName} ${objectName}.`;
};

export const sendHttp500 = (params) => {
  const { httpStatus, errorText, error, response } = params;
  console.error(errorText, error);
  response.status(httpStatus ?? 500).send({
    errorText,
  });
};

export const sendCaptchaError = (response) => {
  return response.status(422).json({
    errors: [
      {
        path: "token",
        customMessage: "Captcha was not verified",
      },
    ],
  });
};
