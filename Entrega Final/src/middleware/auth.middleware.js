// Middleware de autenticacion
const loginAuthentication = (req, res, next)=>{
    if(!req.session.user.email){
        return res.status(401).send('Error de autenticacion')
    }
    next()
}

const adminCheck = (req, res, next)=>{
    if(req.user.role !== 'admin'){
        return res.render('denied')
    }   
    next()
}

module.exports = {
    loginAuthentication,
    adminCheck
}