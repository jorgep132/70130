const { Router } = require('express');
const { addProduct, getProductById, deleteProduct, getProductsApi, getProductByIdApi, getProducts } = require('../../controllers/products.controller.js');
const { adminCheck } = require('../../middleware/auth.middleware.js');
const passport = require('passport');


const productsRouter = Router()

// ADMIN - Visualizar todos los productos en formato JSON con toda la informacion
productsRouter.get('/api', passport.authenticate('jwt', { session: false }), adminCheck, getProductsApi)

// ADMIN - Ver el JSON del producto con toda la informacion
productsRouter.get('/api/:pid', passport.authenticate('jwt', { session: false }), adminCheck, getProductByIdApi)

// AUSER - Ver productos
productsRouter.get('/', getProducts)

//  USER - Ver producto buscando con id
productsRouter.get('/:pid', getProductById)

// POST para añadir productos (desde api/products, ya que tambien podemos hacerlo en tiempo real desde /realTimeProducts)
productsRouter.post('/', passport.authenticate('jwt', { session: false }), adminCheck, addProduct)

// ADMIN - Borrar producto buscando por ID
productsRouter.delete('/:pid', passport.authenticate('jwt', { session: false }), adminCheck, deleteProduct)


module.exports = productsRouter