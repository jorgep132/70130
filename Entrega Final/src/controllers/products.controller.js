const { productService } = require("../services");

// Agregamos un producto - ADMIN
const addProduct = async (req, res) => {
    try {
        const {body} = req
        const response = await productService.create(body)
        res.send({status: 'success', payload: response})
    } catch (error) {
        console.log(error)
    }
}

// Vemos los productos paginados
const getProducts = async (req, res) =>{
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
        } = await productService.getPaginated({
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
}

// Ver productos en JSON con toda la info - ADMIN
const getProductsApi = async (req, res) =>{
    try{
        const products = await productService.get()
        res.send({status: 'succes', payload: products})
    }catch(error){
        res.send({status: 'error', error: 'No se pudo obtener los carritos'})
    }
}


// Ver un producto especifico
const getProductById = async (req, res)=>{
    const id = req.params.pid
    
    try {

        const fetchedProduct = await productService.getBy(id)
        res.render('products', {
            product: fetchedProduct
        })
    }catch(err){
        res.status(404).send(err.message)
    }
}

// Tomar un producto especifico y mostrarlo en JSON con toda la info - ADMIN
const getProductByIdApi = async (req, res)=>{
    const id = req.params.pid
    
    try {
        const fetchedProduct = await productService.getBy(id)
        res.send({status: 'Success', payload: fetchedProduct})
    }catch(err){
        res.status(404).send(err.message)
    }
}

const deleteProduct = async (req, res)=>{
    const id = req.params.pid

    try {
        await productService.delete(id);
        res.status(200).send({ status: 'success', message: 'Producto eliminado' });
    } catch (err) {
        res.status(500).send({ status: 'error', message: err.message });
    }
}

module.exports = {
    getProducts,
    addProduct,
    getProductById,
    deleteProduct,
    getProductsApi,
    getProductByIdApi
    
}