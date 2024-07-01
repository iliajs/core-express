export const routes = {
  // System.
  root: "/",
  system: "/system",
  favicon: "/favicon.ico",

  // Auth operations.
  auth_with_one_time_token: "/auth-with-one-time-token", // TODO
  register: "/register",
  login: "/login",
  authorization: "/authorization",
  getAuthUser: "/getAuthUser",
  saveAuthUserConfig: "/saveAuthUserConfig",

  // User.
  user: "/user",

  // Telegram.
  telegram_webhook: `/telegram-web-hook/${process.env.TELEGRAM_WEBHOOK_SECRET}`,

  // Google drive.
  googleDrive: "/google-drive",

  // Client.
  client: "/client",

  // Time slot.
  timeSlot: "/timeSlot",

  // File storage.
  fileStorage: "/fileStorage",

  // Word.
  tag: "/tag",
  translation: "/translation",
  word: "/word",

  // Notify.
  notify: "/notify",

  // Email.
  email: "/email",
};

export const routesWithoutAuthorization = [
  routes.auth_with_one_time_token, // TODO
  routes.favicon,
  routes.login,
  routes.register,
  routes.root, // TODO
  routes.notify,
  //routes.telegram_webhook, // Switch off for now, use long polling.
];
