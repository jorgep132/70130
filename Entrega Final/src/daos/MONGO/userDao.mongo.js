const userModel = require("./models/users.model")

// Manager de usuario
class UserDaoMongo { 
    constructor(){
        this.model = userModel
    }
    // Metodos de usuarios
    create = async newUser => await this.model.create(newUser)
    getBy  = async email => await this.model.findOne(email)
    get    = async () => await this.model.find()
    update = async (id, updatedUser) => await this.model.findByIdAndUpdate(id, updatedUser, { new: true })
    delete = async id => await this.model.findByIdAndDelete(id)
}

module.exports = {
    UserDaoMongo
} 