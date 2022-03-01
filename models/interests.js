const mongoose = require("mongoose");

const interestSchema = mongoose.Schema({
  name: String,
  image: String,
});

const interestModel = mongoose.model("interests", interestSchema);

module.exports = interestModel;
