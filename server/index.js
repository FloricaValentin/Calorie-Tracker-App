const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/users.collection.js");
const userRoute = require("./routes/user.route.js");
const Info = require("./models/infos.collection.js");
const infoRoute = require("./routes/info.route.js");
const Food = require("./models/foods.collection.js");
const foodRoute = require("./routes/food.route.js");
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

app.use(cors());
app.use(express.json());

// routes
app.use("/api/users", userRoute);
app.use("/api/infos", infoRoute);
app.use("/api/foods", foodRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.log("Connection Failed", error);
  });
