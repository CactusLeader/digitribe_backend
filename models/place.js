const mongoose = require("mongoose");

const placeSchema = mongoose.Schema({
  photo: String,
  description: String,
  title: String,
  coordinate: Object,
  rating: Number,
  userId: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
  cityId: String,
});

const placeModel = mongoose.model("places", placeSchema);

module.exports = placeModel;
