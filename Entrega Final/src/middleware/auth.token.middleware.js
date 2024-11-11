const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('../utils/jwt')

// Middleware de autenticacion con token
const authTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if(!authHeader) return res.status(401).send({status: 'error', error: 'not authenticated'})
    // El bearer no nos importa
    
    const token = authHeader.split(' ')[1]
    jwt.verify(token, PRIVATE_KEY, (error, userToken) =>{
        req.user = userToken
        next()
    })
}

module.exports = {
    authTokenMiddleware
}

