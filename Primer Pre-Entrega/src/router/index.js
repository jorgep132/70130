const { Router }    = require('express')
const apiRouter = require('./api/products.router.js')
const productsRouter    = require('./views.router.js')
const { uploader } = require('../utils/uploader.js')
const cartsRouter = require('./api/carts.router.js')
const realTimeProducts = require('./api/realTimeProducts.router.js')
const sessionRouter = require('./session.router.js')
const loginRouter = require('./views.router.js')

const router = Router()

router.post('/',  uploader.single('myFile'), (req, res) => {
    res.send('archivo subido')
})

// Indice con las diferentes rutas que vamos a usar
router.use('/', loginRouter) // Vista para iniciar sesion y registrarse
router.use('/', sessionRouter) // Logica de login, register y current
router.use('/realTimeProducts', realTimeProducts) // Vista sin paginar con CRUD en tiempo real, tanto para los productos como para los carritos. Productos sin ordenar
router.use('/products', productsRouter) // Vista paginada y resumida para el cliente. Productos ordenados y orden personalizado
router.use('/carts', cartsRouter) // Los carritos con sus id y sus productos
router.use('/api/products', apiRouter) // Vista paginada con los objetos y mas detalles para el backend
// Esta route la usamos para subir la foto en tiempo real y mostrarla, tomando como valor la ruta, en el producto 
router.post('/api/upload-photo', uploader.single('thumbnails'), (req, res) => {
    if (req.file) {
        res.json({ filePath: `/images/${req.file.filename}` }); // Devuelve la ruta del archivo
    } else {
        res.status(400).json({ error: 'No se subió ningún archivo' });
    }
});


module.exports = router