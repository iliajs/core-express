import { DataTypes } from "sequelize";
import { orm } from "../connection.js";

export const translationModel = orm.define("translation", {
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});
