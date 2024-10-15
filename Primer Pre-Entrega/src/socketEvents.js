const { uploader } = require('./utils/uploader.js');
const { productManagerMongo } = require('./daos/MONGO/productsManager.mongo.js');
const { cartManagerMongo } = require('./daos/MONGO/cartsManager.mongo.js');

const setupSocketEvents = (io) => {
    // Conectamos
    io.on('connection', async socket => {
        console.log('Cliente conectado');

        // Mostramos los productos en tiempo real
        const realTimeProducts = async () => {
            const products = await productManagerMongo.getProductsRealTime();
            io.emit('products', products);
        };
        // Mostramos los carritos en tiempo real
        const realTimeCarts = async () => {
            const carts = await cartManagerMongo.getCarts();
            io.emit('carts', carts);
        };

        // Al conectarnos emitimos los productos y carritos
        await realTimeProducts();
        await realTimeCarts();

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
                await productManagerMongo.createProduct(data);
                io.emit('product_added_ok');
                await realTimeProducts();
            } catch (err) {
                socket.emit('product_error', err.message);
            }
        });
        // Eliminar productos
        socket.on('eliminar_producto', async productId => {
            try {
                await productManagerMongo.deleteProduct(productId);
                await realTimeProducts();
            } catch (err) {
                socket.emit('products_delete_error', err.message);
            }
        });
        // Añadir productos al carrito
        socket.on('add_to_cart', async ({ cartId, productId, quantity }) => {
            try {
                const product = await productManagerMongo.getProductById(productId);
                if (!product) throw new Error('Producto no encontrado');

                await cartManagerMongo.addProductToCart(cartId, productId, quantity);
                socket.emit('add_to_cart_ok');
            } catch (err) {
                console.error(err.message);
                socket.emit('product_error', err.message);
            }
        });
        // Agregar carrito
        socket.on('agregar_carrito', async data => {
            try {
                await cartManagerMongo.createCart(data);
                io.emit('cart_added_ok');
                await realTimeCarts();
            } catch (err) {
                socket.emit('cart_error', err.message);
            }
        });
        // Eliminar carrito
        socket.on('eliminar_carrito', async cartId => {
            try {
                await cartManagerMongo.deleteCart(cartId);
                io.emit('cart_deleted_ok');
                const carts = await cartManagerMongo.getCarts();
                io.emit('carts', carts);
            } catch (err) {
                socket.emit('cart_error', err.message);
            }
        });
        // Vaciar carritos
        socket.on('vaciar_carrito', async cartId => {
            try {
                const cart = await cartManagerMongo.getCartById(cartId);
                if (!cart) throw new Error('Carrito no encontrado');

                cart.products = [];
                await cart.save();

                io.emit('vaciar_carrito_ok');
                await realTimeCarts();
            } catch (err) {
                socket.emit('vaciar_carrito_error', err.message);
            }
        });
        // Solicitar carritos
        socket.on('request_carts', async () => {
            try {
                const carts = await cartManagerMongo.getCarts();
                socket.emit('carts', carts);
            } catch (err) {
                socket.emit('product_error', err.message);
            }
        });
        socket.emit('request_carts');
    });
};

module.exports = { setupSocketEvents }; 