const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  text: String,
  date: Date,
  userIdEmit: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  userIdReception: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  read: Boolean,
});

const messageModel = mongoose.model("messages", messageSchema);

module.exports = messageModel;
