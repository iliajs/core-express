import pool from "../db/pool.js";
import {log, logObjects, logOperations} from "../helpers/logs.js";
import {appointmentTypes} from "../settings/index.js";

export const createOrUpdateAppointment = async (req, response) => {
  const item = req.body;
    try {
      const res = await pool.query(
        `insert into appointments(customer_id, type, date, week_day, hour, minute, duration, valid_from, created_at) 
          values($1, $2, $3, $4, $5, $6, $7, now() at time zone 'utc', now() at time zone 'utc')  RETURNING id`,
          [item.customerId, item.type, item.date, item.weekDay, item.hour, item.minute, item.duration]
      );
      await log(logObjects.appointment, logOperations.insert, res.rows[0].id, {
        customer_id: item.customerId,
        type: item.type,
        date: item.date,
        week_day: item.weekDay,
        hour: item.hour,
        minute: item.minute,
        duration: item.duration
      })
      response.send({success: true});
    } catch (e) {
      console.error('error when try to add new appointment to database', e);
      response.send({success: false, error: {text: 'error add new appointment to database'}});
    }
}

export const listAppointments = async (req, response) => {
  const customerId = req.query.customerId ? req.query.customerId : null;
  console.log()

  try {
    let dbRes;

    const selectQuery = `select a.id as id, a.hour as hour, a.minute as minute, a.week_day as week_day, TO_CHAR(a.date, 'yyyy-mm-dd') as date,
                         c.id as customer_id, c.id as customer_id, c.name as customer_name, c.price as customer_price, c.currency as customer_currency,
                         c.deleted as customer_deleted,
                         a.type as type, a.deleted as deleted,
                         (select json_agg(appointments_results) from appointments_results where a.id=appointments_results.appointment_id) as results`;

    // TODO I should decide: if I need 'where ${whereQuery}' in select (which is without customerId)
    // const whereQuery = " a.deleted = false and c.deleted = false"

    if (customerId) {
      dbRes = await pool.query(`${selectQuery} from appointments a 
                                left join customers c on a.customer_id=c.id
                                where c.id=$1 and a.deleted=false and a.type=$2
                                order by a.week_day, a.hour, a.minute`, [customerId, appointmentTypes.regular]);
    } else {
      dbRes = await pool.query(`${selectQuery} from appointments a 
                                left join customers c on a.customer_id=c.id
                                where (type=$1 and date >= $2 and date <= $3 and a.deleted=false)
                                  or (type=$4 and a.created_at <= $2 and (a.deleted_at >= $3 or a.deleted=false))
                                order by a.week_day, a.hour, a.minute `,
          [appointmentTypes.single, req.query.startDate, req.query.endDate, appointmentTypes.regular]);
    }

    console.log('appointments listed, count: ', dbRes.rowCount);
    response.send({ success: true, data: dbRes.rows, meta: { count: dbRes.rowCount } });
  } catch (e) {
    console.error('error list appointments from database', e);
    response.send({ success: false, error: { text: 'error list appointments from database' } });
  }
}

export const deleteAppointment = async (req, response) => {
  console.log('appointment to delete...', req.query)
  const id = req.query.id;
  pool.query("update appointments set deleted=true, deleted_at=now() at time zone 'utc', valid_to=now() at time zone 'utc' where id=$1", [id], async (error) => {
    if (error) {
      console.error('error delete appointment, id: ', id);
      throw error
    }
    await log(logObjects.appointment, logOperations.delete, id)
    console.log('appointment marked as deleted, id: ', id);

    response.send({success: true});
  });
}
