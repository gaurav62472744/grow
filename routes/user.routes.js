const express = require("express");
const userModel = require("../Model/user.model");
const bcrypt = require("bcrypt");
const userRoute = express.Router();
const jwt = require("jsonwebtoken");
const authorization = require("../middleware/middleware");

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

userRoute.post("/calculate", authorization, async (req, res) => {
  const { amount, rate, year } = req.body;

  const interest = rate / 100;
  const N = year;
  const M = amount;

  const F = M * ((Math.pow(1 + interest, N) - 1) / interest);

  const annualInvestment = M * N;
  const annualInterest = F - annualInvestment;

  try {
    res.json({
      annualInvestment: annualInvestment.toFixed(0),
      annualInterest: annualInterest.toFixed(0),
      maturityValue: F.toFixed(0),
    });
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = userRoute;
