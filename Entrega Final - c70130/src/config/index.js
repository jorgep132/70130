const { program } = require('../commander')
const dotenv = require('dotenv')
const { MongoSingleton } = require('../utils/singleton')
const {mode} = program.opts()

dotenv.config({
    path: mode === 'development' ? './.env.development' : './.env.production'
})

console.log('variable nombre: ', process.env.NOMBRE)
const { GMAIL_USER, GMAIL_PASS } = process.env;

exports.configObject = {
    port: process.env.PORT || 8080,
    private_key: process.env.PRIVATE_KEY,
    persistance: process.env.PERSISTANCE,
    gmail_user: GMAIL_USER,
    gmail_pass: GMAIL_PASS
}

module.exports.connectDB = async () =>{
    return await MongoSingleton.getInstance()
}