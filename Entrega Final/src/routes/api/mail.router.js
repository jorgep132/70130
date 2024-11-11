const {Router} = require('express')
const { sendEmail } = require('../../utils/sendEmail');
const passport = require('passport');
const { ticketService } = require('../../services');
const { TicketDto } = require('../../dto/ticket.dto');

const routerMail = Router()

routerMail.post('/send/:ticketId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { email, first_name, last_name } = req.user;  // Obtén la info del usuario autenticado
    const { ticketId } = req.params;
    console.log('Id del ticket: ', ticketId);

    try {
        // Obtener el ticket por ID
        const ticket = await ticketService.getBy(ticketId); // Ejemplo de cómo obtener el ticket
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket no encontrado' });
        }
        console.log('Ticket a enviar: ', ticket);

        // Obtener los detalles del ticket
        const ticketDto = new TicketDto(ticket);
        console.log('Ticket a enviar: ', ticketDto);

        // Crear un string HTML con los productos del ticket
        let productDetailsHTML = '';
        ticket.products.forEach(product => {
            productDetailsHTML += `
                <li>
                    <strong>Producto:</strong> ${product.title}<br>
                    <strong>Precio:</strong> $${product.price.toFixed(2)}<br>
                    <strong>Cantidad:</strong> ${product.quantity}<br>
                    <strong>Subtotal:</strong> $${(product.price * product.quantity).toFixed(2)}
                </li>
            `;
        });

        // Enviar el correo con los detalles del ticket y los productos
        await sendEmail({
            userClient: email,
            subject: 'Tu ticket de compra',
            html: `
                <div>
                    <h1¡Gracias por tu compra, ${first_name} ${last_name}!</h1>
                    <p>Tu ticket ha sido generado con los siguientes detalles:</p>
                    <h2>Detalles del Ticket</h2>
                    <ul>
                        <li><strong>Código del ticket:</strong> ${ticketDto.code}</li>
                        <li><strong>Total:</strong> $${ticketDto.amount.toFixed(2)}</li>
                        <li><strong>Usuario:</strong> ${email}</li>
                    </ul>
                    <h3>Productos comprados:</h3>
                    <ul>
                        ${productDetailsHTML}
                    </ul>
                    <p>Gracias por confiar en nosotros. Si tienes alguna pregunta, no dudes en contactarnos.</p>
                </div>
            `
        });

        // Responder con éxito
        res.send('Correo enviado correctamente');
    } catch (err) {
        console.error('Error al enviar el correo:', err);
        res.status(500).json({ error: 'Error al enviar el correo' });
    }
});

module.exports = {
    routerMail
};