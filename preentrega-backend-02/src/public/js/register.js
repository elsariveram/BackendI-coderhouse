
const socket = io();


const form = document.getElementById('registerForm');
const logData = document.getElementById('productContainer');

//------------------------------------
// Función para renderizar productos
function renderProducts(products) {
    // Limpiar el contenedor antes de insertar nuevos productos
    logData.innerHTML = '';

    // Iterar sobre la lista de productos y generar el HTML
    products.forEach(product => {
        const productHTML = `
        <div class="product-card">
            <div class="product-image">
                <img width="20" src="${product.thumbnails[0]}" alt="${product.title}">
            </div>
            <div class="product-details">
                <p><span>ID:</span> ${product.id}</p>
                <p><span>Nombre:</span> ${product.name}</p>
                <p><span>Descripción:</span> ${product.description}</p>
                <p><span>Precio:</span> $${product.price}</p>
                <p><span>Stock:</span> ${product.stock}</p>
                <p><span>Categoría:</span> ${product.category}</p>
                <!-- Botón de eliminar -->
                <button class="delete-button" data-id="${product.id}">Eliminar</button>
            </div>
        </div>`;
        // Insertar el HTML generado en el contenedor
        logData.innerHTML += productHTML;
    });
}

//----------------------------------

// Al cargar la página, obtener y mostrar los productos iniciales
fetch('/api/products')
    .then(response => response.json())
    .then(products => {
        console.log("Productos iniciales:", products);
        renderProducts(products);
    })
    .catch(error => console.error("Error al cargar los productos iniciales:", error));

//INGRESAR PRODUCTO FORMULARIO
        form.addEventListener('submit', e => {
            e.preventDefault();
            const data = new FormData(form);
            console.log(data);
        const obj = {};
        data.forEach((value, key) => obj[key] = value);
        console.log("Objeto formado:");    console.log(obj);
        fetch('/api/products', { 
                method: 'POST',
                body: JSON.stringify(obj),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(result => {
                if (result.status === 201) {
                    return  result.json();
                
                } else {
                    alert("No se pudo ingresar el producto!");
                }
            }).then(
                json => {
                    console.log("Producto ingresado:", json);
                    
                    // Emitir evento con los datos del producto
                    socket.emit('prueba', json);   //aqui se emite ingresar px------------------
            
                    alert("Producto ingresado con éxito!");
            
                    // Resetear el formulario solo si todo salió bien
                    form.reset();
                });

        })

//ELIMINAR PRODUCTO

logData.addEventListener('click', e => {
    if (e.target.classList.contains('delete-button')) {
        const productId = e.target.getAttribute('data-id');
        fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        }).then(response => {
            if (response.ok) {
                socket.emit('eliminar-producto', productId); //aqui se emite eliminar px
                console.log("Producto eliminado con exito", productId);
                alert('Producto eliminado con exito');
                
            } else {
                alert('Error al eliminar el producto');
            }
        });
    }
});
 


// Actualizar el DOM con los productos recibidos via soket
 socket.on('ingreso-producto', (products) => {
    console.log("SI SALIO");
    console.log("Productos recibidos:", products);

    if (!Array.isArray(products)) {
        console.error("ERROR: Los datos recibidos no son un array:", products);
        return;
    }
    
    renderProducts(products);
})
 
 
        