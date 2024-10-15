const { Router } = require('express')
const { productManagerMongo } = require('../daos/MONGO/productsManager.mongo')

const productsRouter = Router()
const loginRouter = Router()

loginRouter.get('/register', (req, res)=>{
    res.render('register')
})
loginRouter.get('/login', (req, res)=>{
    res.render('login')
})
loginRouter.get('/change-pass', (req, res)=>{
    res.render('changepass')
})

// Vista paginada de los productos
productsRouter.get('/', async (req, res) =>{
    // Por defecto tiene limite de 3
    const limit = parseInt(req.query.limit) || 3;
    // Por defecto comienza en la pagina 1
    const pageNum = parseInt(req.query.pageNum) || 1;
    // Por defecto esta ordenado por titulo
    const sortField = req.query.sortField || 'title'
    // Por defecto esta ordenado de forma ascendente
    const sortOrder = parseInt(req.query.sortOrder, 10) || 1
    try {
        // Tendremos pagina previa, pagina siguiente, pagina actual, paginas totales, campo utilizado para ordenar y modo en que se ordena
        const {
            docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page,
            totalPages
        } = await productManagerMongo.getProducts({
                limit,
                page: pageNum,
                sortField,
                sortOrder
            })
        res.render('products', {
            products: docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page,
            totalPages,
            sortField,
            sortOrder
        })

    }catch(err){
        console.log(err)
    } 
})
productsRouter.get('/:pid', async (req, res)=>{
    // Mostramos un producto especificado en el pid
    const id = req.params.pid
    try {
        // Llamamos al metodo de productManagerMongo para buscar un producto por id
        const fetchedProduct = await productManagerMongo.getProductById(id)
        res.render('products', {
            product: fetchedProduct
        })
    }catch(err){
        res.send(err.message)
    }
    
})

module.exports = productsRouter
module.exports = loginRouter

