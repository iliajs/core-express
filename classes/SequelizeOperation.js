import { Sequelize } from "sequelize";

export default class SequelizeOperation {
  instance;

  constructor() {
    const options = {
      logging: false,
    };
    this.instance = new Sequelize(
      process.env.POSTGRES_CONNECTION_STRING,
      options
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
    if (process.env.UPDATE_DATABASE_STRUCTURE !== "true") {
      return;
    }

    const options = {};

    if (process.env.REMOVE_ALL_DATABASE_DATA === "true") {
      options.force = true;
    }

    await this.instance.sync(options);
  }
}
