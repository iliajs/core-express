export const routes = {
  ROOT: "/",
  FAVICON: "/favicon.ico",
  AUTH_WITH_ONE_TIME_TOKEN: "/auth-with-one-time-token",
  TELEGRAM_WEBHOOK: `/telegram-web-hook/${process.env.TELEGRAM_WEBHOOK_SECRET}`,
  APPOINTMENT: "/appointment",
  APPOINTMENT_RESULT: "/appointment_result",
  APPOINTMENTS: "/appointments",
  CUSTOMERS: "/customers",
  CUSTOMER: "/customer",
  hi: "/hi",
  words: "/word",
  translations: "/translation",
  googleDrive: "/google-drive",
  credentials: "/credentials",
};

export const ROUTES_WITHOUT_AUTHORIZATION = [
  routes.ROOT,
  routes.FAVICON,
  routes.AUTH_WITH_ONE_TIME_TOKEN,
  routes.TELEGRAM_WEBHOOK,
];
