// Lo que hace singleton es corrobrar si existe una instancia de una clase.
// Si existe, devuelve la instancia, sino crea una nueva.
// Esto es para evitar crear multiples instancias de la misma clase
const { connect } = require('mongoose')
// Vamos a aplicarlo en una UNICA conexion a la bdd
class MongoSingleton {
    // Que sea STATIC nos permite acceder al metodo sin instanciar la Clase
    // Un ejemplo de STATIC es Date.now() ya que nunca instanciamos la Clase Date
    static #instance // Con el # la hacemos privada
    constructor(){
        connect('mongodb+srv://Jorge:Sevenfold132.@70125.gr6xs.mongodb.net/c70130-Primer-Pre-Entrega')
    }

    static getInstance(){
        // Si ya fue ejecutado antes
        if(this.#instance){
            console.log('Base de datos ya conectada')
            return this.#instance
        }
        // La primera vez que lo ejecutamos
        this.#instance = new MongoSingleton()
        console.log('Base de datos conectada')
        return this.#instance
    }
}

module.exports = {
    MongoSingleton
}