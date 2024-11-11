import { cancellation } from "./cancel.js";
import { emptyCart } from "./emptyCart.js";
import { purchase } from "./purchase.js";

// Funcion para corroborar el usuario logueado
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null; 
}

let purchaserId = '';
let total = 0;
let products = [];

// GET para tomar el usuario con la funcion getCookie
fetch('http://localhost:8080/users/current', {
    method: 'GET',
    headers: {
        // Usamos la cookie para obtener el token
        'Authorization': `Bearer ${getCookie('token')}`  
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.datauser && data.datauser['Correo electrónico']) {
            const cartId = data.datauser['Carrito'];
            purchaserId = data.datauser['Correo electrónico'];  
        }else{
            return
        }

        // Tomamos el elemento total ya que este tomara como valor la suma total de todos los subtotales
        const totalElement = document.querySelector('.total');
        
        document.querySelectorAll('.producto').forEach(producto => {
            const title = producto.querySelector('h2').textContent.replace('Producto: ', '')

            // Convertimos en valores numericos cuando definimos las const 
            const price = parseFloat(producto.getAttribute('data-price')); 
            const quantity = parseInt(producto.querySelector('.carrito').getAttribute('data-quantity'));

            // Subtotal que usaremos para calcular el total de todo lo que debera gastar el cliente
            // Al realizar la compra
            const subTotal = price * quantity // Precio del producto * cantidad 
            
            const productId = producto.getAttribute('data-id')

            // Integamos el subtotal en el HTML para que lo vea el cliente
            const subTotalElement = producto.querySelector('.subTotal')
            subTotalElement.textContent = `Subtotal: $${subTotal.toFixed(2)}` // Determinamos cantidad de decimales

            total += subTotal // El total es la suma de todos los subtotales
            totalElement.textContent = `Total: $${total.toFixed(2)}` // Definimos dos decimales
            
            // Agregamos toda la info al array products
            products.push({
                title,
                price,
                quantity,
                productId
            });
        });

        // Funcion para verificar si el carrito esta vacio o no
        emptyCart(products);

        // Definimos el boton purchaseButton que usaremos como parametro para la funcion purchase (comprqar)
        const purchaseButton = document.querySelector('.purchase');

        // Llamamos a la funcion con los parametros
        purchase(purchaseButton, purchaserId, total, products)

    })
    .catch(err => {
        return
});

// Definimos boton para cancelar
const cancel = document.querySelector('.cancel');

// Llamamos a la funcion brindando los productos y el elemento (boton) que activara el evento
cancellation(cancel, products)