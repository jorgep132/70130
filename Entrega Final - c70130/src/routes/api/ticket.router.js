const { Router } = require('express');
const { createTicket, getTicket, getTickets } = require('../../controllers/ticket.controller');
const { cancelPurchase, finalizePurchase } = require('../../controllers/carts.controller');
const passport = require('passport');
const { adminCheck } = require('../../middleware/auth.middleware');

const ticketRouter = Router();

// POST - Crear ticket
ticketRouter.post('/create', createTicket);

// POST - Finalizar compra
ticketRouter.post('/checkout', passport.authenticate('jwt', { session: false }), finalizePurchase);

// POST - Cancelar compra
ticketRouter.post('/purchase/cancel/', passport.authenticate('jwt', { session: false }), cancelPurchase)

// ADMIN - Ver ticket
ticketRouter.get('/:ticketId', passport.authenticate('jwt', { session: false }), adminCheck, getTicket)

// ADMIN - Ver tickets
ticketRouter.get('/', passport.authenticate('jwt', { session: false }), adminCheck, getTickets)

module.exports = {
    ticketRouter
};