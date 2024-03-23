const mongoose = require('mongoose')

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email']
    },
    subject: {
        type: String,
        required: [true, 'Please provide a subject']
    },
})

module.exports = mongoose.model('Contact', ContactSchema)