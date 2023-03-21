const crypto = require('crypto')

const hashString = (string) => crypto.createHash(string).digest('hex')

module.exports = hashString