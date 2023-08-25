import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../connection.js";

export const Translation = sequelizeInstance.define("translation", {
  text: {
    type: DataTypes.CHAR(1000),
    allowNull: false,
  },
});
