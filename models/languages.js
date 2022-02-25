const mongoose = require('mongoose')

const languageSchema = mongoose.Schema({
    name: String,
})

const languageModel = mongoose.model('languages', languageSchema)

module.exports = languageModel;