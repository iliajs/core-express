import { serverPort, systemStatus } from "../settings/system.js";

const info = async (req, response) => {
  response.send({
    port: serverPort,
    status: systemStatus.alive,
    mode: process.env.NODE_ENV,
  });
};

export default { info };
