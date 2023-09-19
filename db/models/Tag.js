import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../sequelize.js";

export const Tag = sequelizeInstance.define("tag", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});
