import { Word } from "./models/Word.js";
import { Translation } from "./models/Translation.js";

Word.hasMany(Translation, {
  foreignKey: {
    allowNull: false,
  },
});

Translation.belongsTo(Word);
