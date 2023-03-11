import { Category } from "./category.js";
import { Expense } from "./expense.js";

Category.hasMany(Expense);
Expense.belongsTo(Category);
