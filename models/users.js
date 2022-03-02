const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  lastname: String,
  firstname: String,
  email: String,
  password: String,
  token: String,
  birthdate: Date,
  photo: String,
  description: String,
  language: String,
  interestIds: Array,
  cityId: String,
  location: {
    lat: Number,
    lon: Number,
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
