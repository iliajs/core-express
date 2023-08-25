import { Word } from "./Word.js";
import { Translation } from "./Translation.js";

Word.hasMany(Translation, {
  foreignKey: {
    allowNull: false,
  },
});

Translation.belongsTo(Word);
