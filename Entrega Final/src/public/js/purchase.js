
export function purchase(purchaseButton, purchaserId, total, products){
    
    purchaseButton.addEventListener('click', function() {

    // SWAL para que el cliente confirme si quiere finalizar la compra
    Swal.fire({
        title: '¿Estás seguro de que deseas finalizar la compra?',
        text: "¡Este proceso no se puede deshacer!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, finalizar compra',
        cancelButtonText: 'No, cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('http://localhost:8080/tickets/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    total,       
                    products,     
                    purchaserId   
                })
            })
            .then(response => response.json())
            .then(data => {

                const ticketId = data.ticketId;

                // FETCH post donde enviamos por correo el mail, tomando el ticketId del ticket creado
                return fetch(`http://localhost:8080/email/send/${ticketId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${getCookie('token')}` 
                    }
                });
            })
            .then(() => {   
                
                // Finalizamos la compra con el POST checkout
                const cartId = this.getAttribute('data-id');

                products.forEach(product => {
                    const { productId, quantity } = product;

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
                    timer: 1000 
                });
                setTimeout(() => {
                    // Redirigimos a products una vez se finalizo la compra
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
                    timer: 2000
                });
            });
        } else {
            return;
        }
    });
});
}