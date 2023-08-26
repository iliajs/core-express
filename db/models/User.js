import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../sequelize.js";

export const User = sequelizeInstance.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hash: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
  },
  {
    defaultScope: {
      attributes: {
        exclude: ["hash"],
      },
    },
    scopes: {
      withHash: {
        attributes: {
          include: ["hash"],
        },
      },
    },
  }
);
