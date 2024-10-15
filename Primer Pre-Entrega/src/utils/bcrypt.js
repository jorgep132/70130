// Utilidad para encriptar pass, usando bcrypt.
const bcrypt = require('bcrypt')

// Hasheamos                                              
const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
// passwordBody -> cliente/body // userPassword -> bdd 
const isValidPassword = (passwordBody, userPassword) => bcrypt.compareSync(passwordBody, userPassword)

module.exports = {
    createHash,
    isValidPassword
}