const { CartDaoMongo } = require("../daos/MONGO/cartDao.mongo.js");
const { ProductDaoMongo } = require("../daos/MONGO/productDao.mongo.js");
const { TicketDaoMongo } = require("../daos/MONGO/ticketDao.mongo.js");
const { UserDaoMongo } = require("../daos/MONGO/userDao.mongo.js");

const cartService = new CartDaoMongo()
const productService = new ProductDaoMongo()
const userService = new UserDaoMongo()
const ticketService = new TicketDaoMongo()

module.exports = {
    cartService,
    productService,
    userService,
    ticketService
}
    