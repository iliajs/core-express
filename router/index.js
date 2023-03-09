import { LANG } from "../settings/lang.js";
import { authWithOneTimeToken } from "../controllers/auth.js";
import {
  createOrUpdateAppointment,
  deleteAppointment,
  listAppointments,
} from "../controllers/appointment.js";
import { processWebHook } from "../controllers/telegram.js";
import {TELEGRAM_UPDATE_METHODS, UI_FILE_PATH} from "../settings/index.js";
import { ROUTES } from "../settings/routes.js";
import { createOrUpdateCustomer, deleteCustomer, listCustomers, showCustomer } from "../controllers/customer.js";
import { createAppointmentResult } from "../controllers/appointmentResult.js";
export const router = (app, serverPort) => {
  // Return frontend page.
  app.get('/', (req, res) => {
    res.sendFile(`${UI_FILE_PATH}/index.html`);
  });

  // Root route.
  app.get(ROUTES.ROOT, (req, res) => res.send(LANG.serverIsRunning(serverPort)))

  // Telegram webhook.
  if (process.env.TELEGRAM_UPDATE_METHOD === TELEGRAM_UPDATE_METHODS.webhook) {
    app.post(ROUTES.TELEGRAM_WEBHOOK, processWebHook);
  }

  // Authorization.
  app.post(ROUTES.AUTH_WITH_ONE_TIME_TOKEN, authWithOneTimeToken);

  // Customers.
  app.get(ROUTES.CUSTOMERS, listCustomers);
  app.get(`${ROUTES.CUSTOMER}/:id`, showCustomer);
  app.delete(`${ROUTES.CUSTOMER}/:id`, deleteCustomer);
  app.post(ROUTES.CUSTOMER, createOrUpdateCustomer);

  // Appointments.
  app.get(ROUTES.APPOINTMENTS, listAppointments);
  app.delete(ROUTES.APPOINTMENT, deleteAppointment);
  app.post(ROUTES.APPOINTMENT, createOrUpdateAppointment);

  // Appointments results.
  app.post(ROUTES.APPOINTMENT_RESULT, createAppointmentResult);
}
