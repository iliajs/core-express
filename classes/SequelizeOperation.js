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
    if (process.env.REMOVE_ALL_DATABASE_DATA !== "true") {
      return;
    }

    const options = {
      force: false,
    };

    await this.instance.sync(options);
  }
}
