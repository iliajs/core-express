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
      console.error("Sequelize cannot connect to database", error);
    }
  }

  async updateDatabaseStructure() {
    if (process.env.REMOVE_ALL_DATABASE_DATA !== "true") {
      return;
    }
    const options = {
      force: true,
    };

    await this.instance.sync(options);
  }
}
