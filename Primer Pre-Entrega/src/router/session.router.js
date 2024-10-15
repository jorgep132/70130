const { Router } = require('express')
const { UserManagerMongo } = require('../daos/MONGO/usersManager.mongo.js')
const passport = require('passport')
const { generateToken } = require('../utils/jwt.js')
const { createHash, isValidPassword } = require('../utils/bcrypt.js')

const sessionRouter = Router()
const userService = new UserManagerMongo()

// Current para verificar el jwt
sessionRouter.get('/api/sessions/current', passport.authenticate('jwt',{session: false}),(req, res)=>{
    res.send({dataUser: req.user, message: 'datos sensibles'})
})

// Si detectamos alguna falla con el done redireccionamos a otra pagina.
sessionRouter.post('/register', passport.authenticate('register', {failureRedirect: '/sessions/failregister'}), async (req, res) =>{
    res.send({status: 'succes', message: 'Usuario registrado.'})
})
// Pagina redireccionada si falla la estrategia
sessionRouter.get('/sessions/failregister', async (req, res) =>{
    res.send({status: 'error', error: 'fallo estrategia'})
})
// Logica del logion
sessionRouter.post('/login', passport.authenticate('login', {failureRedirect: '/sessions/failogin'}), async (req, res) => {
    req.session.user = {
        email: req.user.email,
        role: req.user.role
    }
    const userFound = await userService.getUser({email: req.user.email})
    const token = generateToken({id: userFound._id, role: userFound.role})
    //httpOnly: true para no ver desde el navegador. Solo se accede por peticion http
    res.cookie('token', token, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true} ).send({
        status: 'succes',
        message: 'usuario logueado',
        data: {
            nombre: userFound.first_name,
            apellido: userFound.last_name,
            username: userFound.email,
        },
        role: userFound.role,
        token
    })
})
// Pagina redireccionada si falla la estrategia
sessionRouter.get('/sessions/failogin', async (req, res) => {
    res.send({status: 'error', error: 'fallo el login'})
})
// Cambiar password
sessionRouter.post('/change-pass', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // Tomamos el email, que para nosotros el usuario, y la pass nueva
    const { email, newPassword } = req.body; 

    try {
        const user = await userService.getUser({email});
        // Verificamos si existe el user
        if(!user){
            return res.status(404).send({status:'error', error:'Usuario no encontrado.'})
        }
        // Hasheamos la nueva password
        user.password = createHash(newPassword); // Hashea la nueva contraseña
        await user.save();

        // Notificamos que fue cambiada
        res.send({ status: 'success', message: 'Contraseña cambiada exitosamente.' });
    } catch (error) {
        // Notificamos si hubo un error
        res.status(500).send({ status: 'error', error: 'Error al cambiar la contraseña.' });
    }
});


module.exports = sessionRouter, userService