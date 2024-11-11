const { socketProduct } = require('./socketProduct.js');

const socketEvents = (io) => {
    // Conectamos
    io.on('connection', async socket => {
        console.log('Cliente conectado');
        
        socketProduct(io, socket)
        // Añadir productos al carrito
    })
}

module.exports = socketEvents