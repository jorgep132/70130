const { productModel } = require("../../models/products.model.js")

class ProductManagerMongo {
    constructor(){
        this.model = productModel
    }
    // Utilizaremos este metodo unicamente para la vista en tiempo real, ya que no tiene paginacion
    getProductsRealTime   = async () => await this.model.find().lean()

    // Utilizaremos este metodo para la vista /products ya que esta paginada.
    getProducts = async ({limit, page, sortField, sortOrder}) => {
        try {
            // Opciones de paginacion
            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                lean: true,
                sort: sortField ? {[sortField] : sortOrder} : {}
            };
            const result = await this.model.paginate({}, options);
            return result;
        } catch (error) {
            throw new Error('Error al obtener productos: ' + error.message);    
        }
    }
    // Buscar producto por su Id, permitiendo la opcion de products/pid
    getProductById = async id => await this.model.findById(id).lean()

    // Creamos producto, este lo utilizaremos en tiempo real completando el form y usando el boton 'agregar producto'
    createProduct = async newProduct => await this.model.create(newProduct)

    // Borramos el producto, utilizando su id. Esto se realizara en tiempo real mediante el boton 'eliminar producto'
    deleteProduct = async productId => {
        const result = await this.model.findByIdAndDelete(productId);
        if (!result) {
            throw new Error('Producto no encontrado');
        }
    }
}
// Instanciamos la clase ProductManagerMongo
const productManagerMongo = new ProductManagerMongo()

module.exports = {
    ProductManagerMongo,
    productManagerMongo
}