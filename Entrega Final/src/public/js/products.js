document.querySelectorAll('.seeProduct').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        // Redirigimos a la ruta correspondiente
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

fetch('http://localhost:8080/users/current', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${getCookie('token')}`  // Usamos la cookie para obtener el token
    }
})
    .then(response => response.json())  // Convertimos la respuesta a JSON
    .then(data => {
        console.log('Respuesta del servidor:', data);
        console.log('Carrito del usuario', data.datauser.Carrito) 
        // Aquí obtenemos el cartId desde la respuesta
        if (data.datauser && data.datauser.Carrito) {
            cartId = data.datauser.Carrito;  // Asignamos el cartId aquí
            const seeCartButton = document.querySelector('.seeCart');
            if (seeCartButton) {
                seeCartButton.setAttribute('data-id', cartId);  // Asigna el cartId al atributo 'data-id' del botón
            }
            console.log('cartId obtenido:', cartId);  // Verifica si el cartId se obtiene correctamente
        } else {
            console.error('No se encontró cartId en los datos del usuario.');
        }
    })
    .catch(err => {
        console.error('Error al obtener el cartId:', err);
    });

    const addProduct = document.querySelectorAll('.addToCart');
    addProduct.forEach(button => {
        button.addEventListener('click', evt => {
            evt.preventDefault();
    
            // Obtener el productId y la cantidad seleccionada
            const productId = evt.target.getAttribute('data-id');
            console.log('Producto: ', evt.target.getAttribute('data-id'))
            console.log('Id del producto: ', productId)
            const quantity = evt.target.closest('div').querySelector('.quantity-input').value;
    
            if (!cartId) {
                console.error('No se ha encontrado el cartId');
                return;
            }
    
            // Enviar una solicitud POST para agregar el producto al carrito
            fetch('http://localhost:8080/carts/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getCookie('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cartId: cartId,
                    productId: productId,
                    quantity: parseInt(quantity, 10)  // Asegúrate de que la cantidad sea un número
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Respuesta del servidor:', data);
                    if (data.success) {
                        location.reload()
                        // Tal vez quieras actualizar el UI o mostrar un mensaje
                    } else {
                        console.error('Error al añadir al carrito:', data.message);
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