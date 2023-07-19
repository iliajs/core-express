import { DataTypes } from "sequelize";
import { orm } from "../connection.js";

export const wordModel = orm.define("word", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});
