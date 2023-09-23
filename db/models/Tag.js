import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../sequelize.js";

export const Tag = sequelizeInstance.define("tag", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});
