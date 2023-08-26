import { Sequelize } from "sequelize";

export default class SequelizeOperation {
  instance;

  constructor() {
    this.instance = new Sequelize(process.env.POSTGRES_CONNECTION_STRING);
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
