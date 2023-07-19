export const getSimpleErrorText = (actionName, objectName) => {
  return `Exception. Cannot ${actionName} ${objectName}.`;
};

export const sendError = (params) => {
  const { httpStatus, errorText, error, response } = params;
  console.error(errorText, error);
  response.status(httpStatus).send({
    errorText,
  });
};
