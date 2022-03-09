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
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
});

userSchema.index({ location: "2dsphere" });

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
