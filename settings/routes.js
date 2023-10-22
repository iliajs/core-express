export const routes = {
  // System.
  root: "/",
  system: "/system",
  favicon: "/favicon.ico",

  // Authentication & authorization.
  auth_with_one_time_token: "/auth-with-one-time-token", // TODO
  register: "/register",
  login: "/login",
  authorization: "/authorization",

  // User.
  user: "/user",

  // Telegram.
  telegram_webhook: `/telegram-web-hook/${process.env.TELEGRAM_WEBHOOK_SECRET}`,

  // Google drive.
  googleDrive: "/google-drive",

  // Credential.
  credential: "/credential",

  // Word.
  tag: "/tag",
  translation: "/translation",
  word: "/word",
};

export const routesWithoutAuthorization = [
  routes.auth_with_one_time_token, // TODO
  routes.favicon,
  routes.login,
  routes.register,
  routes.root, // TODO
  routes.telegram_webhook,
];
