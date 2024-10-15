const jwt = require('jsonwebtoken')

const PRIVATE_KEY = 'CoderSecret@Para-La-Firma'

const generateToken = user => jwt.sign(user, PRIVATE_KEY, {expiresIn: '1d'})

module.exports = {
    generateToken,
    PRIVATE_KEY
}