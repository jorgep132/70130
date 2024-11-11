// Funcion para cancelar la compra
export function cancellation(cancel, products){
    cancel.addEventListener('click', function() {

    // Tomamos el atributo dentro del boton
    const cartId = this.getAttribute('data-id');
    
    // Swal para que el usuario confirme o cancele la cancelacion
    Swal.fire({
            title: '¿Estás seguro de que deseas cancelar la compra?',
            text: "¡Este proceso no se puede deshacer!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cancelar la compra',
            cancelButtonText: 'No, volver',
        }).then((result) => {
            if (result.isConfirmed) {
                // Para cada producto, envía su ID y la cantidad para cancelar la compra
                products.forEach(product => {
                    const { productId, quantity } = product;
                    console.log('Datos que recibo: ', { cartId, productId, quantity })

                    // POST para cancelar la venta
                     fetch(`http://localhost:8080/tickets/purchase/cancel`, {
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
                    })
                    .then(response => response.json())
                    .then(data => {
                        // Informamos que se cancelo correctamente
                        Swal.fire({
                            title: 'Cancelación exitosa',
                            text: 'La compra ha sido cancelada correctamente.',
                            icon: 'success',
                            showConfirmButton: false, 
                            timer: 2000
                        });

                        // Timeout para volver a la pagina con los productos
                        setTimeout(() => {
                            window.location.href = 'http://localhost:8080/products'; 
                            }, 2000);  
                        })
                    .catch(error => {
                        console.error('Error al cancelar la compra:', error);
                        Swal.fire({
                            title: 'Error',
                            text: 'Hubo un problema al cancelar la compra.',
                            icon: 'error',
                            showConfirmButton: false, 
                            timer: 2000 
                        });
                    });
                });
            } else {
                return;  
            }
        });
    })
}