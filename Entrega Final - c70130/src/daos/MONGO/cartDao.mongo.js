const { cartModel } = require("./models/carts.model");

// Clase para definir el modelo de nuestros carritos y sus metodos.
class CartDaoMongo {
    constructor() {

        this.model = cartModel;
    }
    
    // Creamos un carrito nuevo, asignando un id desde mongoose
    create = async () => {
        const newCart = new this.model();
        return await newCart.save();
    }

    // Nos va a mostrar los productos que tiene el carrito, utilizando populate.
    get = async () => await this.model.find().populate('products.product').lean()

    // Obtener un carrito por su ID
    getBy = async (_id, user) => {
        return await this.model.findOne({_id, user}).populate('products.product');
    }

    getById = async (cartId) => await this.model.findById(cartId)
        
    // Metodo para borrar el carrito
    delete = async id => {
        // Tomando el id del carrito realizamos el delete.
        // Esto lo haremos en tiempo real con el boton 'Eliminar carrito'
        const result = await this.model.findByIdAndDelete(id);
        return result;
    }

    empty = async (cartId) => {
        try {
            const cart = await this.getBy(cartId);
            if (!cart) throw new Error('Carrito no encontrado');
            
            cart.products = [];
            await cart.save();

        } catch (err) {
            res.status(500).send({ status: 'error', message: 'Error al vaciar el carrito', error: err.message });
        }
    }
}

module.exports = {
    CartDaoMongo
};