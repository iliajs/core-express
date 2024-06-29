import pool from "express";

export class TelegramUpdateModel {
  async markAsProcessed(telegramUpdateId, isDeferred = false) {
    try {
      await pool.query(
        "insert into processed_telegram_updates(id, is_deferred) values($1, $2)",
        [telegramUpdateId, isDeferred]
      );
      console.log(
        `telegram update marked as processed, update_id: ${telegramUpdateId}`
      );
    } catch (err) {
      console.error(
        `error mark telegram update as processed, update_id: ${telegramUpdateId}`,
        "is_deferred: ",
        isDeferred
      );
    }
  }
  async findProcessed(telegramUpdateId) {
    try {
      const res = await pool.query(
        "select id from processed_telegram_updates where id=$1",
        [telegramUpdateId]
      );

      return !!res.rows.length;
    } catch (err) {
      console.error(
        "error find processed telegram update, update_id:",
        telegramUpdateId,
        err
      );
    }
  }
}
