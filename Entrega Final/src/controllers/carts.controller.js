const { cartService, productService } = require("../services");

const getCarts = async (req, res) => {
        try {
            const fetchedCarts = await cartService.get()
            res.render('carts', {
                carts: fetchedCarts
            })
        } catch (error) {
            console.log(error)
    }
}
const getCartsApi = async (req, res) => {
    try {
        const fetchedCarts = await cartService.get()
        return res.send({status: 'success', payload: fetchedCarts})
    } catch (error) {
        console.log(error)
}
}

const createCart = async (req, res) => {
    try{
        const newCart = await cartService.create()
        res.status(201).json(newCart)
    }catch(err){
        res.status(500).send(err.message)
    }
}

const getCartById = async (req, res) => {
    const cartId = req.params.cartId;
    try {
        const fetchedCart = await cartService.getBy(cartId);
        
        // Aseguramos que el objeto tenga solo propiedades propias
        const cartWithOwnProps = fetchedCart.toObject ? fetchedCart.toObject() : fetchedCart;

        res.render('cart', { cart: cartWithOwnProps });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getCartByIdApi = async (req, res) => {
    const cartId = req.params.cartId;
    try {
        const fetchedCart = await cartService.getBy(cartId);

        return res.send({status: 'success', payload: fetchedCart})
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const deleteCart = async (req, res) => {
    const { cartId } = req.params;
    try {
        await cartService.delete(cartId);
        res.status(200).send({ status: 'success', message: 'Carrito eliminado' });
    } catch (err) {
        res.status(500).send({ status: 'error', message: err.message });
    }
}

const addToCart = async (req, res) => {
    const { cartId, productId, quantity } = req.body;
    console.log('Datos recibidos:', { cartId, productId, quantity });

    try {
        // Obtener el carrito por ID
        const cart = await cartService.getById(cartId);
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Carrito no encontrado' });
        }

        // Buscar si el producto ya está en el carrito
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex > -1) {
            // Si el producto ya está en el carrito, actualizamos la cantidad
            cart.products[productIndex].quantity += quantity;
        } else {
            // Si no está, lo agregamos al carrito
            cart.products.push({ product: productId, quantity });
        }
        await productService.updateStock(productId, quantity, 'decrease');

        // Guardar el carrito con el producto agregado/actualizado
        await cart.save();

        // Responder con éxito
        res.send({ success: true, message: 'Producto añadido al carrito' });
    } catch (error) {
        // Manejar cualquier error
        res.status(500).json({ success: false, message: 'Error al añadir el producto al carrito', error: error.message });
    }
};
 

const cancelPurchase  = async (req, res) => {
    const { cartId, productId, quantity } = req.body;
    console.log('Datos recibidos:', { cartId, productId, quantity });

    try {
        
        await productService.updateStock(productId, quantity, 'increase')
        await cartService.empty(cartId);

        res.status(200).send({ status: 'success', message: 'Carrito vaciado correctamente' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al vaciar el carrito', error: error.message });
    }
};


const finalizePurchase = async (req, res) => {
    const { cartId, productId, quantity } = req.body;  // Recibimos los productos y el cartId
    console.log('Datos recibidos:', { cartId, productId, quantity });

    try {

        await cartService.empty(cartId);

        res.status(200).send({ status: 'success', message: 'Compra finalizada y stock actualizado correctamente' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al finalizar la compra', error: error.message });
    }
};



module.exports = {
    getCarts,
    createCart,
    getCartById,
    deleteCart,
    getCartsApi,
    addToCart,
    cancelPurchase,
    finalizePurchase,
    getCartByIdApi
}