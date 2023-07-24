export const unknownErrorText = (actionName, objectName) => {
  return `Exception. Cannot ${actionName} ${objectName}.`;
};

export const sendError = (params) => {
  const { httpStatus, errorText, error, response } = params;
  console.error(errorText, error);
  response.status(httpStatus ?? 500).send({
    errorText,
  });
};
