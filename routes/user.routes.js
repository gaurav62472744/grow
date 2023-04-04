const express = require("express");
const userModel = require("../Model/user.model");
const bcrypt = require("bcrypt");
const userRoute = express.Router();
const jwt = require("jsonwebtoken");

userRoute.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        console.log({ message: err.message });
      } else {
        const user = new userModel({
          name,
          email,
          password: hash,
        });
        await user.save();
        res.send("user registered successfully");
      }
    });
  } catch (error) {
    res.send({ message: err.message });
  }
});

userRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.find({ email });

    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (result) {
          const token = jwt.sign({ userID: user[0]._id }, "grow_calculator");
          res.send({ message: "user login successfully", token });
        } else {
          res.send("Wrong Credentials");
        }
      });
    }
  } catch (error) {
    res.send({ message: error.message });
  }
});

userRoute.get("/getProfile", async (req, res) => {
  const user = await userModel.find();
  res.send(user);
});

module.exports = userRoute;
