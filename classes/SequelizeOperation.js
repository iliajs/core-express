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
      console.log(
        "Connection to the database has been established successfully;"
      );
    } catch (error) {
      console.error("Unable to connect to the database; error:", error);
    }
  }

  async sync() {
    // (!) Needed to update tables structure. It will delete all the data in all the tables.

    await this.instance.sync({ force: true });
    console.log("db sync finished");

    // Second variant with alter;
    //await sequelizeInstance.sync({ alter: true });
  }
}
