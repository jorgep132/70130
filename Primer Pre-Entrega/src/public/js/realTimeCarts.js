const socket = io();
const agregarCarrito = document.querySelector('#agregarCarrito');
const cartSelect = document.querySelector('#cartSelect');
const vaciarCarrito = document.querySelector('#vaciarCarrito');

// Solicitar la lista de carritos cuando se carga la página, ya que es en tiempo real
socket.emit('request_carts');

// Menu desplegable con los carritos que tenemos en la bdd
socket.on('carts', carts => {
    cartSelect.innerHTML = '<option value="">Selecciona un carrito</option>'; // Limpiar y agregar opción inicial
    carts.forEach(cart => {
        // Cada carrito tendra estas caracteristicas ya que de esa manera podemos elegirlo y trabajar sobre este
        const option = document.createElement('option');
        option.value = cart._id;
        // Mostramos el carrito elegido con su id
        option.textContent = `Carrito: ${cart._id}`;
        cartSelect.appendChild(option);
    });
});

// Evento para agregar un carrito nuevo, donde se asigna un id desde mongoose
agregarCarrito.addEventListener('click', async evt =>{
    // Prevenimos el default para que no se actualice la pagina
    evt.preventDefault()
    try{
        const cart = {
            product: [],
            quantity: 0
        }
        socket.emit('agregar_carrito', cart)
    }catch(err){
        socket.emit('cart_error', err.message);
    }
    
})

// Evento para borrar un carrito (borrando todo lo que contiene)
borrarCarrito.addEventListener('click', async evt => {
    // Prevenimos el default para que no se actualice la pagina
    evt.preventDefault();
    const cartId = cartSelect.value;
    // Vamos a notificar al cliente que su accion no es reversible
    if (cartId) {
        Swal.fire({
            title: "Esta acción eliminará el carrito de manera permanente",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Eliminar el carrito.",
            cancelButtonText: "Cancelar"
            // Si el cliente esta de acuerdo, se avanza con la eliminacion del carrito
        }).then((result) => {
            if (result.isConfirmed) {
                socket.emit('eliminar_carrito', cartId);
                Swal.fire({
                    title: "Carrito eliminado",
                    icon: "success"
                });
            } else {
                // Si el cliente no desea borrar el carrito, se cancela su eliminacion
                Swal.fire({
                    title: "Operación cancelada",
                    confirmButtonText: 'Volver'
                });
            }
        });
    } else {
        // Si queremos añadir un producto sin elegir carrito nos notificara ya que no podremos avanzar
        Swal.fire({
            title: "Selecciona un carrito",
            icon: "warning"
        });
    }
});

// Evento para vaciar carrito (sin eliminarlo, borrando unicamente su contenido)
vaciarCarrito.addEventListener('click', () => {
    const cartId = cartSelect.value;

    // Le notificamos al cliente que su accion es definitiva
    if (cartId) {
        Swal.fire({
            title: "Esta acción vaciará el carrito de manera permanente",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Vaciar el carrito.",
            cancelButtonText: "Cancelar"
            // Si desea eliminar el carrito, se procede
        }).then((result) => {
            if (result.isConfirmed) {
                socket.emit('vaciar_carrito', cartId);
                // Si el cliente no quiere borrarlo, se cancela y volvemos
            } else {
                Swal.fire({
                    title: "Operación cancelada",
                    confirmButtonText: 'Volver'
                });
            }
        });
    } else {
        // Si queremos vaciar un carrito sin elegir uno, nos notificara
        Swal.fire({
            title: "Selecciona un carrito",
            icon: "warning"
        });
    }
});

// Alerts, sus nombres son autodescriptivos
socket.on('cart_error', errorMessage => {
    Toastify({
        text: errorMessage,
        duration: 1000
    }).showToast();
});
socket.on('cart_added_ok', () => {
    Toastify({
        text: 'Carrito agregado con exito',
        duration: 1000
    }).showToast();
});
socket.on('cart_deleted_ok', () => {
    Toastify({
        text: 'Carrito eliminado con éxito',
        duration: 1000
    }).showToast();
    // Actualiza la lista de carritos
    socket.emit('request_carts');
});
socket.on('vaciar_carrito_ok', () => {
    Toastify({
        text: 'Carrito vaciado con éxito',
        duration: 1000
    }).showToast();
    // Actualiza la lista de carritos
    socket.emit('request_carts');
});
socket.on('vaciar_carrito_error', errorMessage => {
    Toastify({
        text: errorMessage,
        duration: 1000
    }).showToast();
});
