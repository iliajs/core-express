import { wordModel } from "./wordModel.js";
import { translationModel } from "./translationModel.js";

wordModel.hasMany(translationModel, {
  foreignKey: {
    allowNull: false,
  },
});
translationModel.belongsTo(wordModel);
