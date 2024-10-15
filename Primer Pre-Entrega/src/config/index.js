const { connect } = require('mongoose')

exports.connectDB = async () => {
    console.log('Base de datos conectada')
    await connect('mongodb+srv://Jorge:Sevenfold132.@70125.gr6xs.mongodb.net/c70130-Primer-Pre-Entrega')   
}
