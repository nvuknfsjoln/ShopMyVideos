const crypto = require('crypto');

function generateVoucherCode(length = 10) {
    return crypto.randomBytes(length).toString('hex').slice(0, length).toUpperCase();
}

module.exports = { generateVoucherCode };
