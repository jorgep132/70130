const userModel = require("../../models/users.model.js")

// Manager de usuario
class UserManagerMongo {
    constructor(){
        this.model = userModel
    }
    // Metodos de usuarios
    createUser = async newUser => await this.model.create(newUser)
    getUser    = async filter => await this.model.findOne(filter)
    getUsers   = async filter => await this.model.find(filter)
    updateUser = async (id, updatedUser) => await this.model.findByIdAndUpdate(id, updatedUser, { new: true })
    deleteUser = async id => await this.model.findByIdAndDelete(id)
}

module.exports = {
    UserManagerMongo
}