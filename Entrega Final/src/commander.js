const { Command, CommanderError } = require('commander')

const program = new Command()

program
    // Variable para el debug
    .option('-d', 'Variables para debug', false)
    // Puerto que usa el servidor
    .option('-p <port>', 'Puerto del servidor', 4000)
    // Usuario
    .option('-u, --user <user>', 'usuario del proceso')
    // Modo, por ej: production
    .option('--mode <mode>', 'Especificar el entorno de ejecucion de nuestro servidor', 'development')
    .option('l, --letter [letter...]', 'specify letter')
program.parse()

// opt nos devuelve un objeto con los valores
console.log('option: ', program.opts())
// Para ver los argumentos (args)
console.log('Argumentos: ', program.args)
// Comandos que se ejecutan en la consola:
//  node commander.js -d -p 3000 --mode production -u root --letter a b c
//  node commander.js -d -p 8000 -u root 2 a 5 --letter a b c // Esto nos devuelve 2 a 5 como Argumentos en un array

module.exports = {
    program
}