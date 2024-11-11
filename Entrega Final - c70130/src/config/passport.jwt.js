const passport = require('passport')
const jwt = require('passport-jwt')
// const { UserManagerMongo } = require('../daos/MONGO/usersManager.mongo')
const { PRIVATE_KEY } = require('../utils/jwt')

const JWTStrategy = jwt.Strategy
const ExctractJWT = jwt.ExtractJwt
// const userService = new UserManagerMongo()

const initializePassportJWT = () => {
    // Funcion para extraer el jwt de la cookie
    const cookieExtractor = req => {
        let token = null
        if(req && req.cookies){
            token = req.cookies['token']
        }
        return token
    }
    passport.use('jwt', new JWTStrategy({
        // Funcion para desencriptar los jwt extraidos de la cookie
        jwtFromRequest: ExctractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done)=>{
        try{
            // que mande el contenido al token desencriptado
            return done(null, jwt_payload)
        }catch(error){
            return done(error)
        }
    }))
}

module.exports = {
    initializePassportJWT
}