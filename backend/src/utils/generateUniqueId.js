const crypto = require('crypto')

const generateUniqueId = () => {
    return crypto.randomBytes(4).toString('HEX');
}

module.exports = generateUniqueId