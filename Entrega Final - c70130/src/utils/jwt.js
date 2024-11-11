const jwt = require('jsonwebtoken')

const PRIVATE_KEY = 'CoderSecret@Para-La-Firma'

const generateToken = user => {
    const userPayload = {
        id: user.id,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        cart: user.cart
    }
    return jwt.sign(userPayload, PRIVATE_KEY, {expiresIn: '1d'})
} 

module.exports = {
    generateToken,
    PRIVATE_KEY
}