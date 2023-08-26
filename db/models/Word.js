import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../sequelize.js";

export const Word = sequelizeInstance.define("word", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});
