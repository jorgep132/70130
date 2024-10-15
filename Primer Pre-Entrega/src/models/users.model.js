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
        unique: true,
    },
    password:{
        type: String,
        required: true
    },
    cart: [
        {
            id: { type: Schema.Types.ObjectId, ref: 'carts', required: true},
        }
    ],
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
})

const userModel = model(userCollection, userSchema)

module.exports = userModel