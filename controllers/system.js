import { serverPort } from "../settings/port.js";
import { systemStatus } from "../settings/system.js";

export const system = async (req, response) => {
  response.send({ status: systemStatus.alive, port: serverPort });
};
