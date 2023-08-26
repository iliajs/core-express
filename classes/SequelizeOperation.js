import { Sequelize } from "sequelize";

export default class SequelizeOperation {
  instance;

  constructor() {
    this.instance = new Sequelize(
      `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_BASE}`
    );
  }

  async connect() {
    try {
      await this.instance.authenticate();
      await this.updateDatabaseStructure();
    } catch (error) {
      console.error("Unable to connect to the database; error:", error);
    }
  }

  async updateDatabaseStructure() {
    if (process.env.REMOVE_ALL_DATABASE_DATA !== "true") {
      return;
    }
    const options = {
      force: true,

      // TODO: Try to use instead of "force", probably, it's more safety?
      //{ alter: true }
    };

    await this.instance.sync(options);
  }
}
