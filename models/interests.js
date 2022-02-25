const mongoose = require('mongoose')

const interrestSchema = mongoose.Schema({
    name: String,
    image: String,
})

const interrestModel = mongoose.model('interrests', interrestSchema)

module.exports = interrestModel;