const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    text: String,
    date: Date,
    userIdEmit: String,
    userIdReception: String,
})

const messageModel = mongoose.model('messages', messageSchema)

module.exports = messageModel;