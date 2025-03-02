
const logData = document.getElementById('productContainer');

//------------------------------------
// Función para renderizar productos
function renderProducts(products) {
    // Limpiar el contenedor antes de insertar nuevos productos
    logData.innerHTML = '';
    console.log(products);
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
                 <a href="/products/${product._id}" class="view-product">Ver Producto</a>
               
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
        renderProducts(products.payload);  // Aquí pasamos solo el array de productos
    })
    .catch(error => console.error("Error al cargar los productos iniciales:", error));
// fetch('/api/products')
//     .then(response => response.json())
//     .then(products => {
//         console.log("Productos iniciales:", products);
//         renderProducts(products);
//     })
//     .catch(error => console.error("Error al cargar los productos iniciales:", error));


