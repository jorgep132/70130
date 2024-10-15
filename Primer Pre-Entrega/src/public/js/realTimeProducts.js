const socket = io();

// Variables
const agregarProducto = document.querySelector('#agregar');
const productTitle = document.querySelector('#title');
const productDescription = document.querySelector('#description');
const productCode = document.querySelector('#code');
const productPrice = document.querySelector('#price');
const productStatus = document.querySelector('#status');
const productStock = document.querySelector('#stock');
const productCategory = document.querySelector('#category');
const productThumbnails = document.querySelector('#thumbnails');


// Socket para mostrar los productos, ya que es en tiempo real
socket.on('products', products => {
    const productContainer = document.querySelector('#product-list');
    productContainer.innerHTML = '';

    // Por cada producto vamos a modificar nuestro html
    // Por cada producto se agrega un boton de 'añadir al carrito' y otro boton de 'eliminar'
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.innerHTML = `
            <h2>Titulo: ${product.title}</h2>
            <h2>Descripcion: ${product.description}</h2>
            <h2>Codigo: ${product.code}</h2>
            <h2>Precio: ${product.price}</h2>
            <h2>Estado: ${product.status ? 'Verdadero' : 'Falso'}</h2>
            <h2>Stock: ${product.stock}</h2>
            <h2>Category: ${product.category}</h2>
            <img src="${product.thumbnails}" class="foto_producto">
            <button type='button' class='delete' data-id='${product._id}'>Eliminar</button>
            <button type='button' class='addCart' data-id='${product._id}'>Añadir al carrito</button>
        `;
        productContainer.appendChild(productDiv);
    });

    // Evento para el boton 'añadir al carrito'
    const addCartButtons = document.querySelectorAll('.addCart');
    addCartButtons.forEach(button => {
        button.addEventListener('click', evt => {
            evt.preventDefault();
            // Al hacer click, tomamos el valor de product _id
            const productId = evt.target.getAttribute('data-id');
            // Tomamos el valor del _id del carrito elegido en el menu desplegable
            const cartId = cartSelect.value;

            // Si el carrito existe vamos a añadir el producto, aumentando su cantidad de 1 en 1, comenzando en 1 si no habia ningun producto igual
            if (cartId) {
                socket.emit('add_to_cart', { cartId, productId, quantity: 1 });
                // Si se añade correctamente, se notifica
                socket.on('add_to_cart_ok', () => {
                    Toastify({
                        text: 'Producto añadido al carrito',
                        duration: 1000
                    }).showToast();
                });
                // De lo contrario, si no tenemos seleccionado ningun carrito lo notificamos
            } else {
                Swal.fire({
                    title: "Selecciona un carrito",
                    icon: "warning"
                });
            }
        });
    });

    // Evento para el boton de eliminar producto
    const deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async evt => {
            // Notificamos al cliente que el producto se borra permanentemente
            Swal.fire({
                title: "Esta accion borrara el producto de manera permanente",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Borrar el producto.",
                cancelButtonText: "Cancelar"
                // Si el cliente avanza
              }).then((result) => {
                    if (result.isConfirmed) {
                        // Se toma el valor dentro de data-id, siendo el _id del producto
                        const productId = evt.target.getAttribute('data-id');
                        // Se ejecuta el socket para eliminar ese producto, utilizando el _id obtenido
                        socket.emit('eliminar_producto', productId);
                        Swal.fire({
                            title: "Producto eliminado",
                            icon: "success"
                        });
                        // Si el cliente cancela la operacion, volvemos
                    } else {
                        Swal.fire({
                        title: "Operacion cancelada",
                        confirmButtonText: 'Volver'
                    });
                }
            });
        });
    });
});

// Evento para agregar un producto
agregarProducto.addEventListener('click', async evt => {
    // Prevenimos la actualizacion de la pagina, ya que es en tiempo real
    evt.preventDefault();
    const file = productThumbnails.files[0];
    let thumbnailPath = '';
    // Verificamos, mediante mongoose, que todos los datos sean validos (basandonos en nuestro model)
    try {
        if (file) {
            thumbnailPath = await uploadPhoto(file);
        }
        // Si se cumplen los datos, se crea el producto
        const product = {
            title: productTitle.value,
            description: productDescription.value,
            code: productCode.value,
            price: productPrice.value,
            status: productStatus.checked,
            stock: productStock.value,
            category: productCategory.value,
            thumbnails: thumbnailPath
        };
        // Emitimos el evento para agregarlo
        socket.emit('agregar_producto', product);
    } catch (err) {
        // Si hay errores, nos lo notificara por default mongoose
        socket.emit('product_error', err.message);
    }
});

// Función para subir la foto
const uploadPhoto = async (file) => {
    const formData = new FormData();
    formData.append('thumbnails', file);

    const response = await fetch('/api/upload-photo', {
        method: 'POST',
        body: formData
    });
    if (!response.ok) {
        throw new Error('Error al subir la foto');
    }
    const data = await response.json();
    return data.filePath;
};

// Alerts
socket.on('product_error', errorMessage => {
    Toastify({
        text: errorMessage,
        duration: 1000
    }).showToast();
});
socket.on('products_delete_error', errorMessage => {
    Toastify({
        text: errorMessage,
        duration: 1000
    }).showToast();
});
socket.on('product_added_ok', () => {
    Toastify({
        text: 'Producto agregado con exito',
        duration: 1000
    }).showToast();
});
socket.on('add_to_cart')