import { Category } from "./category.js";
import { Expense } from "./expense.js";

Category.hasMany(Expense, {
  foreignKey: {
    allowNull: false,
  },
});
Expense.belongsTo(Category);
