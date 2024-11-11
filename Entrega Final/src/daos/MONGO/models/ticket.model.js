const { Schema, model, SchemaType } = require('mongoose')

// Nombramos nuestra coleccion
const collectionName = 'ticket'

// Schema con los datos que contendran nuestros carritos
const ticketSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true,
        default: function() {
            return 'TICKET-' + Math.random().toString(36).substr(2, 9); // Generación de código aleatorio
        }
    },
    purchase_date_time: {
        type: Date,
        default: Date.now()
    },
    amount: {
        type: Number,
        required: true,   
    },
    purchaser: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true

    },
    products: [
        {
            title: String,
            price: Number,
            quantity: Number,
            thumbnails: String,
        }
    ]
})

const ticketModel = model(collectionName, ticketSchema)

module.exports = {
    ticketModel
}