const mongoose = require("mongoose");

const citySchema = mongoose.Schema({
  neighborhood: String,
  name: String,
  description: String,
});

const cityModel = mongoose.model("cities", citySchema);

module.exports = cityModel;
