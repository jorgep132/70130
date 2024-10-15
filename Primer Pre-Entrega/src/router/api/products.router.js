const { Router } = require('express')
const { ProductManagerMongo, productManagerMongo } = require('../../daos/MONGO/productsManager.mongo')

const router = Router()
const productService = new ProductManagerMongo()

// GET para visualizar los productos desde api/products con su respectiva paginacion
router.get('/', async (req, res) => {
    // Por default sera 3 su limit
    const limit = parseInt(req.query.limit) || 3;
    // Por default etaremos en la pag 1
    const pageNum = parseInt(req.query.pageNum) || 1;
    try {
        // Mostramos los productos, paginando con los valores de limit y page
        const products = await productService.getProducts({limit, page: pageNum})
        res.send({status: 'success', payload: products})
    } catch (error) {
        console.log(error)
    }
})

// POST para añadir productos (desde api/products, ya que tambien podemos hacerlo en tiempo real desde /realTimeProducts)
router.post('/', async (req, res) => {
    try {
        const {body} = req
        // mas validaciones
        const response = await productService.createProduct(body)
        res.send({status: 'success', payload: response})
    } catch (error) {
        console.log(error)
    }
})

// GET buscando por ID api/products/pid
router.get('/:pid', async (req, res)=>{
    // Tomamos el id indicando en la url
    const id = req.params.pid
    try {
        // Llamamos al metodo de productManager para buscar un producto por id
        const fetchedProduct = await productManagerMongo.getProductById(id)
        res.send({status: 'success', payload: fetchedProduct})
    }catch(err){
        res.status(404).send(err.message)
    }
})

// DELETE utilizando el adi api/products/pid
router.delete('/:pid', async (req, res)=>{
    // Tomamos el id ingresado en la url
    const id = req.params.pid
    console.log(id)
    try {
        await productManagerMongo.deleteProduct(id);
        res.status(200).send({ status: 'success', message: 'Producto eliminado' });
    } catch (err) {
        res.status(500).send({ status: 'error', message: err.message });
    }
})

module.exports = router