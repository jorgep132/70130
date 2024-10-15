const passport = require('passport')
const passportLocal = require('passport-local')
const { UserManagerMongo } = require('../daos/MONGO/usersManager.mongo')
const { createHash, isValidPassword } = require('../utils/bcrypt')

const LocalStrategy = passportLocal.Strategy
const userService = new UserManagerMongo

const intializePassport = () => {
    // Estrategia para registrarse
    passport.use('register', new LocalStrategy({
        passReqToCallback: true, // Accedemos al REQ del cliente
        usernameField: 'email' // Passport toma por defecto 'username' en este caso
        // le indicamos que tome el campo email en su lugar.
    }, async (req, username, password, done) => {
        // Logica del register:
        const {first_name, last_name} = req.body
        try{
            let userFound = await userService.getUser({email: username})
            if(userFound){
                return done(null, false) // Especificamos que no tiene error y falso
                // porque no tiene usuario, sino mail
            }
            let newUser = {
                first_name,
                last_name,
                email: username,
                password: createHash(password)
            }
            let result = await userService.createUser(newUser)
            return done(null, result) // No hay error y devuelve el resultado
        }catch(err){
            // Hay error y lo devuelve
            return done('Error al crear un usuario.'+err)
        }
    }))
    // Estrategia para el login
    passport.use('login', new LocalStrategy({
        usernameField: 'email',
    }, async (username, password, done) => {
        try{
            // Buscamos que el username, que seria el email, exista.
            const user = await userService.getUser({email: username})
            if(!user) return done(null, false)
            // Verificamos que la password sea la correcta
            if(!isValidPassword(password, user.password)) return done(null, false)
            return done(null, user)
        }catch(err){
            return done(err)
        }
    }))
    // Guardamos idSession
    passport.serializeUser((user, done)=>{
        done(null, user.id)
    })
    passport.deserializeUser(async (id, done)=>{
        let user = await userService.getUser({_id: id})
        done(null, user)
    })
}

module.exports = {
    intializePassport
}