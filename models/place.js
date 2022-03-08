const mongoose = require("mongoose");

const placeSchema = mongoose.Schema({
  photo: String,
  description: String,
  title: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  rating: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  // likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
  cityId: String,
});

placeSchema.index({ location: "2dsphere" });

const placeModel = mongoose.model("places", placeSchema);

module.exports = placeModel;
