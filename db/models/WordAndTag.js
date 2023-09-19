import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../sequelize.js";
import { Word } from "./Word.js";
import { Tag } from "./Tag.js";

export const WordAndTag = sequelizeInstance.define("wordsAndTags", {
  wordId: {
    type: DataTypes.INTEGER,
    references: {
      model: Word,
      key: "id",
    },
  },
  tagId: {
    type: DataTypes.INTEGER,
    references: {
      model: Tag,
      key: "id",
    },
  },
});
