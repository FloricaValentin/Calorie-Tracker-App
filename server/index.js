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



app.use(cors());
app.use(express.json());

// routes

app.use("/api/users", userRoute);
app.use("/api/infos", infoRoute);
app.use("/api/foods", foodRoute)

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
mongoose
  .connect(
    "mongodb+srv://vali:du3nYpX8RI7Wucal@cluster0.gcafdo9.mongodb.net/your-database-name?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(() => {
    console.log("Connection Failed");
  });
