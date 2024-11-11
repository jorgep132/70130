const { Router } = require('express');
const { uploader } = require('../utils/uploader.js');
const cartsRouter = require('./api/carts.router.js');  // Importa el router de carritos
const realTime = require('./api/realTime.router.js');
const usersRouter = require('./users.router.js');
const passport = require('passport');
const { adminCheck } = require('../middleware/auth.middleware.js');
const productsRouter = require('./api/products.router.js');
const { ticketRouter } = require('./api/ticket.router.js');
const { routerMail } = require('./api/mail.router.js');

const router = Router();


// Rutas principales
router.use('/users', usersRouter);
router.use('/email', routerMail)
router.use('/products', productsRouter)
router.use('/tickets', ticketRouter)
router.use('/carts', cartsRouter);

// Rutas relacionadas con la carga de archivos
router.post('/', uploader.single('myFile'), (req, res) => {
    res.send('Archivo subido');
});

// Rutas para subir fotos
router.post('/api/upload-photo', uploader.single('thumbnails'), (req, res) => {
    if (req.file) {
        res.json({ filePath: `/images/${req.file.filename}` }); // Devuelve la ruta del archivo
    } else {
        res.status(400).json({ error: 'No se subió ningún archivo' });
    }
});

// Rutas relacionadas con productos en tiempo real
router.use('/realTimeProducts', passport.authenticate('jwt', { session: false }), adminCheck, realTime);

module.exports = router;