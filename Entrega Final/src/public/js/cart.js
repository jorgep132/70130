import { cancellation } from "./cancel.js";
import { emptyCart } from "./emptyCart.js";
import { purchase } from "./purchase.js";

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;  // Si no existe la cookie, retorna null
}

let purchaserId = '';
let total = 0;
let products = [];

fetch('http://localhost:8080/users/current', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${getCookie('token')}`  // Usamos la cookie para obtener el token
    }
})
    .then(response => response.json())  // Convertimos la respuesta a JSON
    .then(data => {
        console.log('Respuesta del servidor:', data);
        console.log('Mail del usuario: ', data.datauser['Correo electrónico'])
        // Aquí obtenemos el purchaserId desde la respuesta
        if (data.datauser && data.datauser['Correo electrónico']) {
            const cartId = data.datauser['Carrito'];
            console.log('Cart id: ', cartId);
            purchaserId = data.datauser['Correo electrónico'];  // Asignamos el purchaserId aquí
            console.log('Purchaser obtenido:', purchaserId);  // Verifica si el purchaserId se obtiene correctamente
        } else {
            console.error('No se encontró purchaserId en los datos del usuario.');
        }

        // Llamamos a la función purchase solo después de que purchaserId se haya asignado
        const totalElement = document.querySelector('.total');
        // Seleccionamos todos los productos generados por Handlebars
        document.querySelectorAll('.producto').forEach(producto => {
            const title = producto.querySelector('h2').textContent.replace('Producto: ', '')
            const price = parseFloat(producto.getAttribute('data-price')); // Asegúrate de convertirlo a número
            const quantity = parseInt(producto.querySelector('.carrito').getAttribute('data-quantity')); // Obtenemos la cantidad
            const subTotal = price * quantity; // Calculamos el total del producto
            
            const productId = producto.getAttribute('data-id')

            const subTotalElement = producto.querySelector('.subTotal');
            subTotalElement.textContent = `Subtotal: $${subTotal.toFixed(2)}`;

            total += subTotal;
            totalElement.textContent = `Total: $${total.toFixed(2)}`;

            console.log('Producto a agregar al array: ', { title, price, quantity, productId });
            
            // Añadimos el producto al array
            products.push({
                title,
                price,
                quantity,
                productId
            });
        });

        emptyCart(products);

        // Ahora que hemos obtenido el purchaserId correctamente, pasamos la función purchase
        const purchaseButton = document.querySelector('.purchase');
        purchase(purchaseButton, purchaserId, total, products); // Llamamos a purchase después de tener el purchaserId

    })
    .catch(err => {
        console.error('Error al obtener el purchaserId:', err);
});


const cancel = document.querySelector('.cancel');
cancellation(cancel, products)