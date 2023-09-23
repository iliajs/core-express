import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../sequelize.js";

export const Word = sequelizeInstance.define("word", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});
