const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connection = require("./config/db");
const userRoute = require("./routes/user.routes");
const app = express();

app.use(express.json());

app.use(cors());
app.use("/", (req, res) => {
  res.send("Welcome to Grow_calculator");
});
app.use("/user", userRoute);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connection Established to DB");
  } catch (error) {
    console.log(error);
  }
  console.log(`Server is running at port ${process.env.port}`);
});
