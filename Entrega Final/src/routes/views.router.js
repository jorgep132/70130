const { Router } = require('express')
const { getProductById, getProducts } = require('../controllers/products.controller');
const { getCartById } = require('../controllers/carts.controller');
const passport = require('passport');

const viewsRouter = Router()

// Vista paginada de los productos
viewsRouter.get('/products', getProducts)
viewsRouter.get('/products/:pid', getProductById)

module.exports = viewsRouter
