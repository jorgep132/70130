const { Command, CommanderError } = require('commander')

const program = new Command()

program
    .option('--mode <mode>', 'Especificar el entorno de ejecucion de nuestro servidor', 'development')

program.parse()

module.exports = {
    program
}