import pool from "../db/pool.js";

export const logObjects = {
  user: 1,
  customer: 2,
  appointment: 3,
  appointmentResult: 4,
}

export const logOperations = {
  insert: 1,
  update: 2,
  delete: 3
}

export const log = async (object, operation, objectId, values = {}) => {
  try {
    await pool.query(
      "insert into logs(created_at, object, operation, object_id, values) values(now() at time zone 'utc', $1, $2, $3, $4)",
      [object, operation, objectId, values]
    );
  } catch (err) {
    console.error(`error write log to db: object=${object}, operation=${operation}`, err);
  }

}