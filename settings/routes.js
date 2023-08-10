export const routes = {
  system: "/system",
  root: "/",
  favicon: "/favicon.ico",
  users: "/users",
  auth_with_one_time_token: "/auth-with-one-time-token",
  telegram_webhook: `/telegram-web-hook/${process.env.TELEGRAM_WEBHOOK_SECRET}`,
  words: "/word",
  translations: "/translation",
  googleDrive: "/google-drive",
  credentials: "/credentials",
};

export const ROUTES_WITHOUT_AUTHORIZATION = [
  routes.root,
  routes.favicon,
  routes.auth_with_one_time_token,
  routes.telegram_webhook,
];
