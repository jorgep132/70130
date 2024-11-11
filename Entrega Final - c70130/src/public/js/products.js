document.querySelectorAll('.seeProduct').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        
        // Dirigimos al endpoint donde se va a ver unicamente ese producto y podemos manipular el stock y agregar al carrito
        window.location.href = `/products/${productId}`;
    });
});


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;  // Si no existe la cookie, retorna null
}

let cartId = null;

// Obtenemos el token
fetch('http://localhost:8080/users/current', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${getCookie('token')}` 
    }
})
    .then(response => response.json())  
    .then(data => {

        if (data.datauser && data.datauser.Carrito) {
            cartId = data.datauser.Carrito;  // Asignamos el cartId aquí
            const seeCartButton = document.querySelector('.seeCart');
            if (seeCartButton) {
                seeCartButton.setAttribute('data-id', cartId); 
            }
        } else {
            return
        }
    })
    .catch(err => {
        console.error('Error al obtener el cartId:', err);
    });

    // Evento para agregar al carrito
    const addProduct = document.querySelectorAll('.addToCart');
    addProduct.forEach(button => {
        button.addEventListener('click', evt => {
            evt.preventDefault();
    
            const productId = evt.target.getAttribute('data-id');
            const quantity = evt.target.closest('div').querySelector('.quantity-input').value;
    
            // POST para agregar el producto al carrito
            fetch('http://localhost:8080/carts/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getCookie('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cartId: cartId,
                    productId: productId,
                    quantity: parseInt(quantity, 10)
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        location.reload()
                    } else {
                        return
                    }
                })
                .catch(err => {
                    console.error('Error al hacer la solicitud:', err);
                });
        });
    });

    document.querySelectorAll('.seeCart').forEach(button => {
        button.addEventListener('click', function() {
            const cartId = this.getAttribute('data-id');
            if (cartId) {
                // Redirigimos al carrito usando el cartId
                window.location.href = `/carts/${cartId}/purchase`;
            } else {
                console.error('No se encontró el cartId para redirigir');
            }
        });
    });