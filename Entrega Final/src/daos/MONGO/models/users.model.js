const {Schema, model} = require('mongoose')

// Nombre de la coleccion
const userCollection = 'users'

// Schema de usuario
const userSchema = new Schema({
    first_name:{
        type: String,
        required: true
    },
    last_name: String,
    email: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true
    },
    cart:{
        type: Schema.Types.ObjectId,
        ref: 'carts'
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
})

const userModel = model(userCollection, userSchema)

module.exports = userModel