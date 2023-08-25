import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../connection.js";

export const Word = sequelizeInstance.define("word", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});
