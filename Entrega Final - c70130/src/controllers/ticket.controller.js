const { TicketDto } = require("../dto/ticket.dto");
const { ticketService, userService } = require("../services");
1
// Crear ticket
const createTicket = async (req, res) => {
    // Tomamos como datos el usuario que realiza la compra, los productos y el costo total de estos.
    const {total, products, purchaserId} = req.body

    try {
        // Utilizamos el email del usuario.
        const purchaser = await userService.getBy({email: purchaserId})

        // Manejo de errores
        if (!purchaser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        const ticket = await ticketService.create(total, products, purchaser._id)
        const ticketDto = new TicketDto(ticket)

        // Convertimos el objeto en string usando el DTO para especificar la informacion que queremos que reciba el cliente en su ticket
        // Esto luego se enviara por correo
        const ticketResponse = {
            ticketId: ticket._id.toString(), 
            ...ticketDto.toResponse()         
        };

        res.json(ticketResponse);
    } catch(err){
        console.error('Error al crear el ticket:', err);
        res.status(500).json({ error: 'Error al crear el ticket' });
    }
}

// Ver un ticket en particular - ADMIN ya que es informacion sensible
const getTicket = async (req, res) => {
    const ticketId  = req.params.ticketId;

    try {
        const ticket = await ticketService.getBy(ticketId);

        res.json(ticket)
    } catch (error) {
        console.error('Error al obtener el ticket:', error);
        res.status(500).json({ error: 'Error al obtener los datos del ticket' });
    }
};

// Ver los tickets - ADMIN ya que es informacion sensible
const getTickets = async (req, res) => {
    try {
        const fetchedCarts = await ticketService.get()
        res.send({message: 'success', payload: fetchedCarts})
    } catch (err) {
        res.status(500).send(err.message)
    }
}


module.exports = {
    createTicket,
    getTicket,
    getTickets
}