import Orm from "./Orm.js";

const sequelize = new Orm();
await sequelize.connect();
export const orm = sequelize.instance;
