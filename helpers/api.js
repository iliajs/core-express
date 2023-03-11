export const getErrorText = (actionName, objectName) => {
  return `Error ${actionName} ${objectName};`;
};

export const throwAndSendError = (params) => {
  const { httpStatus, errorText, error, response } = params;
  console.error(errorText, error);
  response.status(httpStatus).send({
    errorText,
  });
};
