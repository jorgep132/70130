const { Router } = require('express');
const { deleteCart, getCartsApi, addToCart, getCartByIdApi, getCartById } = require('../../controllers/carts.controller');
const passport = require('passport');
const { adminCheck } = require('../../middleware/auth.middleware');

const cartsRouter = Router();

// ADMIN - Carritos con toda la info
cartsRouter.get('/api', passport.authenticate('jwt', { session: false }), adminCheck, getCartsApi);

// ADMIN - Carrito especifico con toda la info
cartsRouter.get('/api/:cartId', passport.authenticate('jwt', { session: false }), adminCheck, getCartByIdApi);

// Endpoint para realizar o cancelar las compras
cartsRouter.get('/:cartId/purchase', passport.authenticate('jwt', { session: false }), getCartById)

// Borrar un carrito por su ID. ADMIN
cartsRouter.delete('/:cartId', passport.authenticate('jwt', { session: false }), adminCheck, deleteCart);

// Agregar un producto al carrito
cartsRouter.post('/add', passport.authenticate('jwt', { session: false }), addToCart);



module.exports = cartsRouter;