const { TicketDto } = require("../dto/ticket.dto");
const { ticketService, userService } = require("../services");

const createTicket = async (req, res) => {
    const {total, products, purchaserId} = req.body
    console.log('Datos recibidos: ', {total, products, purchaserId})
    try {
        const purchaser = await userService.getBy({email: purchaserId})
        console.log('Usuario: ', purchaser._id)
        console.log('Usuario: ', purchaser.email)
        if (!purchaser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const ticket = await ticketService.create(total, products, purchaser._id)
        const ticketDto = new TicketDto(ticket)

        const ticketResponse = {
            ticketId: ticket._id.toString(),  // Aquí convertimos ObjectId a String
            ...ticketDto.toResponse()         // Enviar el resto de la información
        };
        console.log('Ticket creado:', ticketResponse);
        console.log('Ticket DTO: ', ticketDto)
        res.json(ticketResponse);
    } catch(err){
        console.error('Error al crear el ticket:', err);
        res.status(500).json({ error: 'Error al crear el ticket' });
    }
}

const getTicket = async (req, res) => {
    const ticketId  = req.params.ticketId;
    try {
        const ticket = await ticketService.getBy(ticketId); // Asegúrate de tener este método para obtener el ticket

        // Renderiza la página de compra con los datos del ticket
        res.json(ticket)
    } catch (error) {
        console.error('Error al obtener el ticket:', error);
        res.status(500).json({ error: 'Error al obtener los datos del ticket' });
    }
};

const getTickets = async (req, res) => {
    try {
        const fetchedCarts = await ticketService.get()
        res.send({message: 'success', payload: fetchedCarts})
    } catch (error) {
        console.log(error)
}
}


module.exports = {
    createTicket,
    getTicket,
    getTickets
}