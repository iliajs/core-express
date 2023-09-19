import { Word } from "./models/Word.js";
import { Translation } from "./models/Translation.js";
import { WordAndTag } from "./models/WordAndTag.js";
import { Tag } from "./models/Tag.js";

Word.hasMany(Translation, {
  foreignKey: {
    allowNull: false,
  },
});

Translation.belongsTo(Word);

Word.belongsToMany(Tag, { through: WordAndTag });
Tag.belongsToMany(Word, { through: WordAndTag });
