import { DataTypes } from "sequelize";
import { orm } from "../connection.js";

export const Expense = orm.define("expense", {
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});
