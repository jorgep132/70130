const { cartModel } = require("../../models/carts.model.js");

// Clase para definir el modelo de nuestros carritos y sus metodos.
class CartManagerMongo {
    constructor() {
        this.model = cartModel;
    }
    // Nos va a mostrar los productos que tiene el carrito, utilizando populate.
    getCarts = async () => await this.model.find().populate('products.product').lean()

    // Creamos un carrito nuevo, asignando un id desde mongoose
    createCart = async () => {
        const newCart = new this.model();
        return await newCart.save();
    }
    // Obtener un carrito por su ID
    getCartById = async id => {
        return await this.model.findById(id).populate('products.product');
    }
    // Agregar un producto al carrito
    // Tomamos el id del carrito, el id del producto y la cantidad, que por defecto se agrega de a 1 en 1.
    addProductToCart = async (cartId, productId, quantity) => {
        // Buscamos por id utilizando el cartId
        // Si no existe, mongoose nos devolvera un error por default
        const cart = await this.model.findById(cartId);
        // Buscamos si el productId existe, en principio existira porque se agrega desde el boton 'añadir al carrito' en tiempo real
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex > -1) {
            // Si el producto ya está en el carrito, actualizamos la cantidad
            cart.products[productIndex].quantity += quantity;
        } else {
            // Si el producto no está en el carrito, lo añadimos
            cart.products.push({ product: productId, quantity });
        }
        // Guardamos el carrito
        return await cart.save();
    }
    // Metodo para borrar el carrito
    deleteCart = async id => {
        // Tomando el id del carrito realizamos el delete.
        // Esto lo haremos en tiempo real con el boton 'Eliminar carrito'
        const result = await this.model.findByIdAndDelete(id);
        return result;
    }
}
// Instanciamos la clase CartManagerMongo
const cartManagerMongo = new CartManagerMongo();

module.exports = {
    CartManagerMongo,
    cartManagerMongo
};