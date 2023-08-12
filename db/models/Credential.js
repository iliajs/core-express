import { DataTypes } from "sequelize";
import { orm } from "../connection.js";

export const Credential = orm.define("credential", {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data: {
    type: DataTypes.BLOB,
    allowNull: false,
    get() {
      return this.getDataValue("data").toString("utf8");
    },
  },
});
