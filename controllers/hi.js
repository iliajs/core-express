import { serverPort } from "../settings/port.js";

export const hi = async (req, response) => {
  response.send({ success: true, status: "alive", port: serverPort });
};
