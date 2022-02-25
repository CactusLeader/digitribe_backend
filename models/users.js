const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  lastName: String,
  firstName: String,
  email: String,
  password: String,
  token: String,
  dateofbirth: Date,
  photo: String,
  description: String,
  language: String,
  interestId: Array,
  cityId: String,
  location: {
    lat: Number,
    lon: Number,
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
