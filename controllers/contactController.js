const Contact = require('../models/Contact')
const StatusCodes = require('http-status-codes')
const CustomError = require('../errors')

const createContact = async (req, res) => {
    const { name, email, subject } = req.body

    const contact = await Contact.create({ name, email, subject })

    res.status(StatusCodes.CREATED).json({ msg: "Thank you for your message" })

}

module.exports = { 
    createContact
}  