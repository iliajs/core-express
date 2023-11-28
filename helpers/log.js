import { LANG } from "../settings/lang.js";

import { serverPort } from "../settings/system.js";

export const showServerInfo = () => {
  console.log(LANG.serverStarted(serverPort));
};
