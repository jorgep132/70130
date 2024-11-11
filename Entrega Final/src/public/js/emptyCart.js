export function emptyCart(products) {
    
    const purchaseButton = document.querySelector('.purchase');
    const cancelButton = document.querySelector('.cancel');

    // Si no hay nada en el carrito nos redirecciona a los productos (avisando previamente)
    if (products.length === 0) {
        Swal.fire({
            title: 'Tu carrito está vacío',
            text: 'No tienes productos en tu carrito. Agrega productos para realizar una compra.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        })
        .then(()=>{
            window.location.href = 'http://localhost:8080/products'
        })
        
        // Oculta los botones si no tenemos nada en el carrito
        // No tienen sentido los botones si no hay nada que comprar o cancelar compra
        if (purchaseButton) purchaseButton.style.display = 'none';
        if (cancelButton) cancelButton.style.display = 'none';
        } else {
        if (purchaseButton) purchaseButton.style.display = 'inline-block';
        if (cancelButton) cancelButton.style.display = 'inline-block';
    }
}
