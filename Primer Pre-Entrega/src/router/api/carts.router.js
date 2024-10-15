const { Router } = require('express');
const { cartManagerMongo } = require('../../daos/MONGO/cartsManager.mongo.js');
const { productManagerMongo } = require('../../daos/MONGO/productsManager.mongo.js');

const cartsRouter = Router();

// Crear un nuevo carrito
cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = await cartManagerMongo.createCart();
        res.status(201).json(newCart);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Ver los carritos
cartsRouter.get('/', async (req, res) => {
    try {
        const fetchedCarts = await cartManagerMongo.getCarts()
        res.render('carts', {
            carts: fetchedCarts
        })
    } catch (error) {
        console.log(error)
    }
})

// Obtener un carrito por su ID
cartsRouter.get('/:cartId', async (req, res) => {
    const { cartId } = req.params;

    try {
        const cart = await cartManagerMongo.getCartById(cartId);
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Borrar un carrito por su ID
cartsRouter.delete('/:cartId', async (req, res) => {
    const { cartId } = req.params;

    try {
        await cartManagerMongo.deleteCart(cartId);
        res.status(200).send({ status: 'success', message: 'Carrito eliminado' });
    } catch (err) {
        res.status(500).send({ status: 'error', message: err.message });
    }
});

module.exports = cartsRouter;