const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    timestamp: true,
  },
  {
    versionKey: false,
  }
);

const userModel = mongoose.model("profile", userSchema);

module.exports = userModel;
