// Middleware de autenticacion
const authentication = (req, res, next)=>{
    if(!req.session.user.email){
        return res.status(401).send('Error de autenticacion')
    }
    next()
}

module.exports = {authentication}