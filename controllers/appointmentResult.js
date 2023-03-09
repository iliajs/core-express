import pool from "../db/pool.js";
import {log, logObjects, logOperations} from "../helpers/logs.js";

export const createAppointmentResult = async (req, response) => {
  const item = req.body;

  let operation = "";
  let id = null;

  try {
    const resSelect = await pool.query(
      "select * from appointments_results where appointment_id=$1 and date=$2",
      [item.appointmentId, item.date]
    );

    if (resSelect?.rows?.length) {
      id = resSelect.rows[0].id;
      operation = 'update';
    } else {
      operation = 'insert';
    }
  } catch (e) {
    console.error('error select appointment results from database', e)
  }

  if (!operation) {
    return;
  }

  try {
    if (operation === 'insert') {
      const res = await pool.query(
        `insert into appointments_results(appointment_id, created_at, result, date, price, currency) 
          values($1, now() at time zone 'utc', $2, $3, $4, $5)  RETURNING id`,
        [item.appointmentId, item.result, item.date, item.price, item.currency]
      );

      id = res.rows[0].id;
    } else if (operation === 'update') {
      const res = await pool.query(
        `update appointments_results set updated_at=now() at time zone 'utc', result=$1, currency=$2, price=$3 where id=$4`,
        [item.result, item.currency, item.price, id]
      );
    }

    await log(logObjects.appointmentResult, operation === 'insert' ? logOperations.insert : logOperations.update, id, {
      appointment_id: item.appointmentId,
      result: item.result,
      date: item.date,
      price: item.price,
      currency: item.currency
    })

    response.send({success: true});
  } catch (e) {
    console.error('error when try to add new appointment result to database', e);
    response.send({success: false, error: { text: 'error add new appointment result to database' }});
  };
}
