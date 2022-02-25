const mongoose = require("mongoose");

const placeSchema = mongoose.Schema({
  photo: String,
  description: String,
  title: String,
  coordinate: Object,
  rating: Number,
  userId: String,
  cityId: String,
});

const placeModel = mongoose.model("places", placeSchema);

module.exports = placeModel;
