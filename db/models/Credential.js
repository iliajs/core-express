import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../sequelize.js";

export const Credential = sequelizeInstance.define("credential", {
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
