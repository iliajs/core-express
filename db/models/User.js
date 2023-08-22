import { DataTypes } from "sequelize";
import { orm } from "../connection.js";

export const User = orm.define(
  "user",
  {
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
