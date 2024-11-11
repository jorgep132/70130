const { cartService, productService } = require("../services");

const createCart = async (req, res) => {
    try{
        const newCart = await cartService.create()
        res.status(201).json(newCart)
    }catch(err){
        res.status(500).send(err.message)
    }
}

// Funcion para obtener todos los carritos
const getCarts = async (req, res) => {
        try {
            const fetchedCarts = await cartService.get()
            res.render('carts', {
                carts: fetchedCarts
            })
        } catch (error) {
        res.status(500).send(err.message)
    }
}

// Funcion para obtener los carritos en formato JSON, esto es para ADMIN.
const getCartsApi = async (req, res) => {
    try {
        const fetchedCarts = await cartService.get()
        return res.send({status: 'success', payload: fetchedCarts})
    } catch (error) {
        res.status(500).send(err.message)
    }
}

// Funcion para obtener un carrito y renderizarlo en el handlebars 'cart'.
const getCartById = async (req, res) => {
    const cartId = req.params.cartId
    try {
        const fetchedCart = await cartService.getBy(cartId)
        
        // Sin esta porcion MONGOOSE no me validaba la informacion
        const cartWithOwnProps = fetchedCart.toObject ? fetchedCart.toObject() : fetchedCart

        res.render('cart', { cart: cartWithOwnProps })
    } catch (err) {
        res.status(500).send(err.message)
    }
}

// Funcion para un carrito especifico en formato JSON, esto es para ADMIN.
const getCartByIdApi = async (req, res) => {
    const cartId = req.params.cartId
    try {
        const fetchedCart = await cartService.getBy(cartId)

        return res.send({status: 'success', payload: fetchedCart})
    } catch (err) {
        res.status(500).send(err.message)
    }
};

// Borrar carrito
const deleteCart = async (req, res) => {
    const { cartId } = req.params
    try {
        await cartService.delete(cartId)
        res.status(200).send({ status: 'success', message: 'Carrito eliminado' })
    } catch (err) {
        res.status(500).send({ status: 'error', message: err.message })
    }
}

// Agrega producto al carrito
const addToCart = async (req, res) => {
    const { cartId, productId, quantity } = req.body

    try {
        
        // Buscamos el carrito
        const cart = await cartService.getById(cartId)

        // Manejo de errores
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Carrito no encontrado' })
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId)

        // Si productIndex no es mayor a -1 quiere decir que el producto no esta en el array
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity
        } else {
            cart.products.push({ product: productId, quantity })
        }

        // Una vez se agrega el producto al carrito, se disminuye su stock
        await productService.updateStock(productId, quantity, 'decrease')

        // Guardamos el carrito
        await cart.save();

        res.send({ success: true, message: 'Producto añadido al carrito' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al añadir el producto al carrito', error: error.message })
    }
}
 
// Cancelar la compra
const cancelPurchase  = async (req, res) => {
    const { cartId, productId, quantity } = req.body

    try {
        
        // Devolvemos el stock.
        await productService.updateStock(productId, quantity, 'increase')
        // Vaciamos el carrito
        await cartService.empty(cartId);

        res.status(200).send({ status: 'success', message: 'Carrito vaciado correctamente' })
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al vaciar el carrito', error: error.message })
    }
}

// Finalizar compra
const finalizePurchase = async (req, res) => {
    const { cartId, productId, quantity } = req.body;  // Recibimos los productos y el cartId

    try {

        // Vaciamos el carrito y lo guardamos
        await cartService.empty(cartId);

        res.status(200).send({ status: 'success', message: 'Compra finalizada y stock actualizado correctamente' })
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al finalizar la compra', error: error.message })
    }
}

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