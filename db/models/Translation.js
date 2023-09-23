import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../sequelize.js";

export const Translation = sequelizeInstance.define("translation", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  text: {
    type: DataTypes.CHAR(1000),
    allowNull: false,
  },
});
