const { Schema, model } = require('mongoose')

// Nombramos nuestra coleccion
const collectionName = 'carts'

// Schema con los datos que contendran nuestros carritos
const cartSchema = new Schema({
    products: [
        {
            // Producto con sus atributos
            product: { type: Schema.Types.ObjectId, ref: 'products', required: true},
            // Cantidad, que se incrementara por cada producto 
            quantity: { type: Number, required: true}
        }
    ],
})

const cartModel = model(collectionName, cartSchema)

module.exports = {
    cartModel
}