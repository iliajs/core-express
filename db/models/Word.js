import { DataTypes } from "sequelize";
import { orm } from "../connection.js";

export const Word = orm.define("word", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});
