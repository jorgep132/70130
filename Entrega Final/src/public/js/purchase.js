
export function purchase(purchaseButton, purchaserId, total, products){
    
    purchaseButton.addEventListener('click', function() {
    console.log('El boton anda')
    console.log('El purchaser id es: ', purchaserId)
    if (!purchaserId) {
        console.error('No se ha encontrado el purchaserId (email), no se puede finalizar la compra');
        return;  // Si no tenemos el purchaserId, no podemos continuar
    }

    // Usamos SweetAlert2 para pedir confirmación antes de proceder con la compra
    Swal.fire({
        title: '¿Estás seguro de que deseas finalizar la compra?',
        text: "¡Este proceso no se puede deshacer!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, finalizar compra',
        cancelButtonText: 'No, cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma la compra, procedemos a crear el ticket
            fetch('http://localhost:8080/tickets/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    total,        // Total de la compra
                    products,     // Detalles de los productos
                    purchaserId   // Email del comprador
                })
            })
            .then(response => response.json())
            .then(data => {
                // Aquí recibimos la respuesta con el ticket (si es exitoso)
                console.log('Ticket creado:', data);

                const ticketId = data.ticketId;
                console.log('Ticket ID recibido:', ticketId);

                // Ahora que tenemos el ticket, hacemos la solicitud para enviar el correo
                return fetch(`http://localhost:8080/email/send/${ticketId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${getCookie('token')}`  // Usamos el token si es necesario
                    }
                });
            })
            .then(() => {
                // Después de crear el ticket y enviar el correo, procesamos la compra
                const cartId = this.getAttribute('data-id');
                console.log('Procedemos a borrar el carrito: ', cartId);

                products.forEach(product => {
                    const { productId, quantity } = product;
                    console.log('Datos de productos que recibo: ', { cartId, productId, quantity });

                    fetch('http://localhost:8080/tickets/checkout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${getCookie('token')}`,
                        },
                        body: JSON.stringify({
                            cartId: cartId,
                            productId: productId,
                            quantity: quantity
                        })
                    });
                });
            })
            .then(() => {
                // Si todo ha ido bien, notificamos al usuario
                Swal.fire({
                    title: 'Compra realizada con éxito',
                    text: 'Tu compra se ha procesado correctamente.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1000  // La alerta se cerrará después de 2 segundos
                });
                setTimeout(() => {
                    window.location.href = 'http://localhost:8080/products'
                }, 1000);
                
            })
            .catch(error => {
                console.error('Error al finalizar la compra:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al finalizar la compra.',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 2000  // La alerta se cerrará después de 2 segundos
                });
            });
        } else {
            // Si el usuario cancela, no se hace nada
            return;
        }
    });
});
}