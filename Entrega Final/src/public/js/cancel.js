
export function cancellation(cancel, products){
    cancel.addEventListener('click', function() {

    const cartId = this.getAttribute('data-id');
    
    if (!cartId) {
        console.error('No se ha encontrado cartId. No se puede cancelar la compra.');
        return;
    } else {
        console.log('Este es el cartId: ', cartId);
    }

    // Usamos SweetAlert2 para pedir confirmación antes de continuar
    Swal.fire({
        title: '¿Estás seguro de que deseas cancelar la compra?',
        text: "¡Este proceso no se puede deshacer!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cancelar la compra',
        cancelButtonText: 'No, cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            // Para cada producto, envía su ID y la cantidad para cancelar la compra
            products.forEach(product => {
                const { productId, quantity } = product;
                console.log('Datos que recibo: ', { cartId, productId, quantity })

                // Realizamos la solicitud para cancelar la compra
                fetch(`http://localhost:8080/tickets/purchase/cancel`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie('token')}`,
                    },
                    body: JSON.stringify({
                        cartId: cartId,
                        productId: productId,  // Enviamos el productId de cada producto
                        quantity: quantity     // Enviamos la cantidad de cada producto
                    })
                })
                .then(response => response.json())
                .then(data => {
                    // Aquí mostramos la alerta de éxito sin el botón OK
                    Swal.fire({
                        title: 'Cancelación exitosa',
                        text: 'La compra ha sido cancelada correctamente.',
                        icon: 'success',
                        showConfirmButton: false, // Elimina el botón OK
                        timer: 2000  // La alerta se cerrará después de 2 segundos
                    });

                    // Usamos setTimeout para refrescar la página después de 2 segundos
                    setTimeout(() => {
                        window.location.href = 'http://localhost:8080/products';  // Recarga la página después de 2 segundos
                    }, 2000);  // 2000 milisegundos = 2 segundos
                })
                .catch(error => {
                    console.error('Error al cancelar la compra:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un problema al cancelar la compra.',
                        icon: 'error',
                        showConfirmButton: false, // Elimina el botón OK
                        timer: 2000  // La alerta se cerrará después de 2 segundos
                    });
                });
            });
        } else {
            return;  // Si el usuario cancela, no se hace nada
        }
    });
})
}