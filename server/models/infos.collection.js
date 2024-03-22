const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const InfoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
},
    height: {
        type: Number,
      },
      weight: {
        type: Number,
      },
      age: {
        type: Number,
      },
      gender: {
        type: String,
        enum: ["male", "female"],
      },
      activityType: {
        type: String,
        enum: [
          "no activity",
          "low activity",
          "medium activity",
          "high activity",
          "very high activity",
        ],
      },
      goal: {
        type: String,
        enum: ["lose", "gain", "maintain"],
      },
      dailyCalorieGoal: {
        type: Number,
      },
})

const Info = mongoose.model("Info", InfoSchema);

module.exports = Info;