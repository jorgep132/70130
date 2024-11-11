
const { createHash, isValidPassword } = require("../utils/bcrypt");
const { generateToken } = require("../utils/jwt");
const { userService, cartService } = require("../services");
const { UserDto } = require("../dto/users.dto");

// Crear usuario
const createUser = async (req, res) => {
    const { body } = req

    try {
        const { email, password } = body
        let userFound = await userService.getBy({email})

        // Manejo de errores
        if (userFound) {
            return res.status(400).send({ status: 'error', error: 'El usuario ya existe.' })
        }

        const hashedPassword = createHash(password)

        let userDto = new UserDto({...body, password: hashedPassword})
        await userService.create(userDto);

        return res.send({ status: 'success', message: 'Usuario registrado.', user: userDto.toResponse()})
    } catch (err) {
        return res.status(500).send({ status: 'error', error: 'Error al crear un usuario: ' + err })
    }
}

// Logueo de usuario
const loginUser = async (req, res) => {
    const { body } = req
    
    try {
        const { email, password } = body
        const userFound = await userService.getBy({ email })
        
        // Verificamos lo que ingreso el usuario
        if (!userFound) {
            return res.status(400).send({ status: 'error', error: 'No se encontró el usuario' })
        }

        if (!isValidPassword(password, userFound.password)) {
            return res.status(404).send({ status: 'error', error: 'Contraseña incorrecta' })
        }

        // Si el usuario no tiene carrito (se asigna al loguear), le creamos uno.
        // Si el usuario ya logueo antes, tendra un carrito previo, por lo que evitamos crear otro.
        if(!userFound.cart){
            const cart = await cartService.create()
            userFound.cart = cart._id
            await userFound.save()
        }

        // Generamos el token que usaremos para validar el usuario logueado en current
        const token = generateToken({ id: userFound._id, role: userFound.role, first_name: userFound.first_name, last_name: userFound.last_name, email: userFound.email, cart: userFound.cart }); 

        let userDto = new UserDto(userFound);
        
        // Definimos la cookie y luego mostramos informacion determinada, ocultando informacion sensible
        res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: false }).send({
            status: 'success',
            message: 'Usuario logueado',
            user: userDto.toResponse(),
        })

    } catch (err) {
        console.error('Error al guardar el usuario:', err)
        return res.status(500).send({ status: 'error', error: 'Los datos ingresados no son válidos' })
    }
}

// Deslogueo de usuario, borrando la cookie
const logoutUser = async (req, res) => {
    try {
        // Eliminar la cookie con el token JWT
        res.clearCookie('token', { maxAge: 0, httpOnly: false })  // `secure: false` para desarrollo, en producción debería ser `true`

        res.send({
            status: 'success',
            message: 'Usuario deslogueado exitosamente',
        })
    } catch (err) {
        console.error('Error al desloguear al usuario:', err)
        res.status(500).send({ status: 'error', error: 'No se pudo desloguear al usuario' })
    }
}

// Actualizar password
const updatePassword = async (req, res) => {
    const { email, newPassword } = req.body 

    try {
        const user = await userService.getBy({ email })

        // Verificamos si existe el usuario
        if (!user) {
            return res.status(404).send({ status: 'error', error: 'Usuario no encontrado.' })
        }

        // Hasheamos la nueva contraseña
        const hashedPassword = createHash(newPassword); // Hashea la nueva contraseña

        // Usamos el método update para cambiar la contraseña
        await userService.update(user._id, { password: hashedPassword })

        // Notificamos que fue cambiada
        res.send({ status: 'success', message: 'Contraseña cambiada exitosamente.' })
    } catch (error) {
        // Notificamos si hubo un error
        res.status(500).send({ status: 'error', error: 'Error al cambiar la contraseña.' })
    }
}

// Ver usuarios - ADMIN
const getUsers = async (req, res) => {
    const users = await userService.get()
    res.send({status: 'success', message: users})
}

// Ver usuario en particular - ADMIN
const getUser = async (req, res) => {
    const {email} = req.params 
    try {
        const user = await userService.getBy({email: email})
        if(!user){
            return res.status(404).send({status: 'error', error: 'Usuario no encontrado'})
        }
        res.send({ status: 'success', message: 'Usuario encontrado:', payload: user });
    }catch(error){
        res.status(404).send({status: 'error', error: 'Error al mostrar el usuario'})
    }
}

module.exports = {
    createUser,
    loginUser,
    updatePassword,
    getUsers,
    getUser,
    logoutUser,
};