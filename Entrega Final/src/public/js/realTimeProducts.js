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

// Limpiamos el form
function clearForm() {
    productTitle.value = '';
    productDescription.value = '';
    productCode.value = '';
    productPrice.value = '';
    productStatus.checked = false;
    productStock.value = '';
    productCategory.value = '';
    productThumbnails.value = '';
    productThumbnails.disabled = false; 
}


// Socket para mostrar los productos, ya que es en tiempo real
socket.on('products', products => {
    const productContainer = document.querySelector('#product-list');
    productContainer.innerHTML = '';

    // Por cada producto mostramos sus datos y agregamos el botón de edición
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
            <br>
            <button type='button' class='delete' data-id='${product._id}'>Eliminar</button>
            <button type='button' class='edit' data-id='${product._id}'>Editar</button>
        `;
        productContainer.appendChild(productDiv);
    });

    // Evento para el botón de eliminar producto
    const deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async evt => {
            const productId = evt.target.getAttribute('data-id');
            socket.emit('eliminar_producto', productId);
        });
    });

    // Evento para el botón de editar producto
    const editButtons = document.querySelectorAll('.edit');
    editButtons.forEach(button => {
        button.addEventListener('click', async evt => {
            const productId = evt.target.getAttribute('data-id');
            // Encontramos el producto en el array de productos
            const product = products.find(p => p._id === productId);

            // Llenamos el formulario con los valores actuales del producto
            productTitle.value = product.title;
            productDescription.value = product.description;
            productCode.value = product.code;
            productPrice.value = product.price;
            productStatus.checked = product.status;
            productStock.value = product.stock;
            productCategory.value = product.category;
            productThumbnails.value = ''

            productThumbnails.disabled = true;

            // Mostrar el botón "Confirmar cambios"
            document.querySelector('#confirmarCambios').style.display = 'block';
            document.querySelector('#agregar').style.display = 'none';

            // Al hacer clic en "Confirmar cambios", actualizamos el producto
            document.querySelector('#confirmarCambios').addEventListener('click', async (evt) => {
                evt.preventDefault();

                // Solo actualizamos los campos que han cambiado
                const updatedProduct = {};

                if (productTitle.value !== product.title) {
                    updatedProduct.title = productTitle.value;
                }
                if (productDescription.value !== product.description) {
                    updatedProduct.description = productDescription.value;
                }
                if (productCode.value !== product.code) {
                    updatedProduct.code = productCode.value;
                }
                if (productPrice.value !== product.price) {
                    updatedProduct.price = productPrice.value;
                }
                if (productStatus.checked !== product.status) {
                    updatedProduct.status = productStatus.checked;
                }
                if (productStock.value !== product.stock) {
                    updatedProduct.stock = productStock.value;
                }
                if (productCategory.value !== product.category) {
                    updatedProduct.category = productCategory.value;
                }

                socket.emit('actualizar_producto', productId, updatedProduct);

                // Limpiar el formulario y ocultar el botón de "Confirmar cambios"
                document.querySelector('#confirmarCambios').style.display = 'none';
                document.querySelector('#agregar').style.display = 'block';
                
            });
        });
    });
});


// Evento para agregar un producto
agregarProducto.addEventListener('click', async evt => {
    // Prevenimos la actualizacion de la pagina, ya que es en tiempo real
    evt.preventDefault();
    
    if (productCode.value.length !== 6) {
        Toastify({
            text: 'El código debe tener exactamente 6 caracteres.',
            duration: 2000,
            backgroundColor: 'red',
        }).showToast();
        return;
    }

    const file = productThumbnails.files[0];
    let thumbnailPath = '';
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
        clearForm()
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

// Eeventos .on
socket.on('product_updated_ok', () => {
    Toastify({
        text: 'Producto actualizado con éxito',
        duration: 1000
    }).showToast();
    // Recargar la página después de actualizar el producto
    location.reload();
});

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