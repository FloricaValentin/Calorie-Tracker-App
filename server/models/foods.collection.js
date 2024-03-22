const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  servingSize: {
    type: Number,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  proteins: {
    type: Number,
    required: true,
  },
  carbohydrates: {
    type: Number,
    required: true,
  },
  fats: {
    type: Number,
    required: true,
  },
});

const Food = mongoose.model("Food", FoodSchema);

module.exports = Food;