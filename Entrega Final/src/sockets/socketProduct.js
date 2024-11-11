const { productService } = require("../services");

async function socketProduct(io, socket) {

    const realTimeProducts = async () => {
        const products = await productService.getProductsRealTime();
        io.emit('products', products);
    };

    // Al conectarnos emitimos los productos y carritos
    await realTimeProducts();
    
    // Subida de imagenes
    socket.on('subir_foto', async formData => {
        uploader.single('thumbnails')(formData, null, err => {
            if (err) {
                socket.emit('upload_error', err.message);
            } else {
                console.log('Imagen subida correctamente');
            }
        });
    });
    // Agregar productos
    socket.on('agregar_producto', async data => {
        try {
            await productService.create(data);
            io.emit('product_added_ok');
            await realTimeProducts();
            io.emit('clear_form');
        } catch (err) {
            socket.emit('product_error', err.message);
        }
    });
    // Eliminar productos
    socket.on('eliminar_producto', async productId => {
        try {
            await productService.delete(productId);
            await realTimeProducts();
        } catch (err) {
            socket.emit('products_delete_error', err.message);
        }
    });
    socket.on('actualizar_producto', async (productId, updatedData) => {
        try {
            await productService.update(productId, updatedData); // Asumiendo que tienes una función para actualizar
            await realTimeProducts();
            io.emit('product_updated_ok')
        } catch (err) {
            socket.emit('product_error', err.message);
        }
    });
}


module.exports = {
    socketProduct
}