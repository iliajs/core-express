import SequelizeOperation from "../classes/SequelizeOperation.js";

const sequelizeOperation = new SequelizeOperation();
const sequelizeInstance = sequelizeOperation.instance;

await sequelizeOperation.connect();

export { sequelizeOperation, sequelizeInstance };
