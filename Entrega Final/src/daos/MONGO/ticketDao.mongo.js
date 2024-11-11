const { ticketModel } = require("./models/ticket.model");

class TicketDaoMongo
 {
    constructor(){
        this.model = ticketModel
    }

    // Crear ticket
    create = async (total, products, purchaserId) => {
    const newTicket = new this.model({
        amount: total,
        products, 
        purchaser: purchaserId
    })
    return await newTicket.save()
    }

   // Ver ticket por id
   getBy = async ticketId => await this.model.findById(ticketId)
   
   // Ver tickets
   get = async () => await this.model.find()
   
}

module.exports = {
    TicketDaoMongo
}