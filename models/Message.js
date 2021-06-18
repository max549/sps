const { Schema, model } = require('mongoose')
const moment = require('moment')

const schema = new Schema({
    room: {type: String, require: true},
    username: {type: String, require: true, uniqie: true},
    text: {type: String, require: true},
    date: {type: String, default: moment().format('h:mm a')}
})

module.exports = model('Message', schema)