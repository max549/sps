const { Schema, model } = require('mongoose')
const moment = require('moment')

const schema = new Schema({
    name: {type: String, require: true},
    messages: [{body: String, date: moment().format('h:mm a')}]
})

module.exports = model('Message', schema)