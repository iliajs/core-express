import { DataTypes } from "sequelize";
import { orm } from "../dbConnection.js";

export const Category = orm.define("category", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});
