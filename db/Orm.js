import { Sequelize } from "sequelize";

export default class Orm {
  instance;

  constructor() {
    this.instance = new Sequelize(
      `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_BASE}`
    );
  }

  async connect() {
    try {
      await this.instance.authenticate();
      console.log(
        "Connection to the database has been established successfully;"
      );
    } catch (error) {
      console.error("Unable to connect to the database; error:", error);
    }
  }
}
