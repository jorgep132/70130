const { Router } = require('express')
const passport = require('passport')
const { createUser, loginUser, updatePassword, getUsers, getUser, logoutUser } = require('../controllers/users.controller.js')
const { UserDto } = require('../dto/users.dto.js')
const { adminCheck } = require('../middleware/auth.middleware.js')

const usersRouter = Router()

// Registrar usuario
usersRouter.get('/register', (req, res)=>{
    res.render('register')
})
usersRouter.post('/register', createUser)

// Loguear usuario
usersRouter.get('/login', (req, res)=>{
    res.render('login')
})
usersRouter.post('/login', loginUser)

// Cambiar password
usersRouter.get('/change-pass', (req, res)=>{
    res.render('changepass')
})
usersRouter.post('/change-pass', updatePassword)

// Ver usuario logueado, ocultando informacion sensible
usersRouter.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (!req.user) {
        return res.status(401).send({ status: 'error', error: 'No estás autenticado.' });
    }
    const userDto = new UserDto(req.user)
    res.send({ message: 'Usuario logueado: ', datauser: userDto.toResponse()});
});

// Desloguear
usersRouter.post('/logout', (req, res) => {
    logoutUser(req, res);
});

// ADMIN - Ver usuario con toda su info
usersRouter.get('/:email', passport.authenticate('jwt', { session: false }), adminCheck, getUser)

// ADMIN - Ver todos los usuarios con su info
usersRouter.get('/', passport.authenticate('jwt', { session: false }), adminCheck, getUsers)

module.exports = usersRouter