class TicketDto {
    constructor(ticket){
        this.id                  = ticket._id.toString()
        this.code                = ticket.code,
        this.purchase_date_time  = ticket.purchase_date_time,
        this.amount              = ticket.amount,
        this.purchaser           = ticket.purchaser.toString(),
        this.products = ticket.products || [];

    }

    toResponse() {
        const productsResponse = this.products.map(product => {
            return {
                title: product.title,
                price: product.price,
                quantity: product.quantity,
                subtotal: (product.price * product.quantity).toFixed(2),
                image_url: product.thumbnails  // Subtotal de cada producto
            };
        });
        return {
            'fecha de compra': this.purchase_date_time.toISOString(),  // Formato ISO para la fecha
            'total': this.amount,
            'usuario': this.purchaser,
            'codigo': this.code,
            'productos': productsResponse,
        };
    }
}

module.exports = {
    TicketDto
}