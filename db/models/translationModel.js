import { DataTypes } from "sequelize";
import { orm } from "../connection.js";

export const translationModel = orm.define("translation", {
  text: {
    type: DataTypes.CHAR(1000),
    allowNull: false,
  },
});
