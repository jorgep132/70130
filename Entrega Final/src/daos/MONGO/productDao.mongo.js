const { productModel } = require("./models/products.model")

class ProductDaoMongo
 {
    constructor(){
        this.model = productModel
    }
    // Creamos producto, este lo utilizaremos en tiempo real completando el form y usando el boton 'agregar producto'
    create = async newProduct => await this.model.create(newProduct)
  
    // Obtenemos los productos sin paginar
    get = async () => await this.model.find()
    
    // Buscar producto por su Id, permitiendo la opcion de products/pid
    getBy = async (id) => await this.model.findById(id).lean()

    // Utilizaremos este metodo para ver los products con paginacion
    getPaginated = async ({limit, page, sortField, sortOrder}) => {
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

    // Utilizaremos este metodo unicamente para la vista en tiempo real, ya que no tiene paginacion
    getProductsRealTime   = async () => await this.model.find().lean()

    // Borramos el producto, utilizando su id. Esto se realizara en tiempo real mediante el boton 'eliminar producto'
    delete = async productId => {
        const result = await this.model.findByIdAndDelete(productId);
        if (!result) {
            throw new Error('Producto no encontrado');
        }
    }

    updateStock = async (productId, quantity, action) => {
        const product = await this.model.findById(productId);
        if (!product) throw new Error('Producto no encontrado');
        
        if (action === 'decrease') {
            // Verificamos si el stock es suficiente antes de proceder (restar stock)
            if (product.stock < quantity) {
                throw new Error('Cantidad insuficiente en stock');
            }
            product.stock -= quantity;
        } else if (action === 'increase') {
            // Sumamos el stock (esto es para cuando cancelas la compra)
            product.stock += quantity;
        } else {
            throw new Error('Acción no válida para updateStock');
        }
    
        return await product.save();
    }

    update = async (productId, updatedData) => {
        // Buscamos el producto por su ID
        const product = await this.model.findById(productId);
        if (!product) throw new Error('Producto no encontrado');

        // Actualizamos el producto con los nuevos datos
        Object.assign(product, updatedData);

        // Guardamos el producto actualizado en la base de datos
        return await product.save();
    }
}

module.exports = {
    ProductDaoMongo
}