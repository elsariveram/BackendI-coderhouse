// const logData = document.getElementById('productContainer');
const paginationContainer = document.getElementById('paginationContainer'); // Contenedor de botones de paginación
let currentPage = 1; // Página inicial
let limit = 10; // Número de productos por página



//------------------------------------
// Función para renderizar productos
function renderProducts(products) {
    console.log("Productos:", products);
    paginationContainer.innerHTML = ''; // Limpiar el contenedor antes de insertar nuevos productos
     

    products.forEach(product => {
        console.log( "ID:",product._id);
        const productHTML = `
        <div class="product-card">
            <div class="product-image">
                <img width="20" src="${product.thumbnails[0]}" alt="${product.title}">
            </div>
            <div class="product-details">
                <p><span>ID:</span> ${product._id}</p>
                <p><span>Nombre:</span> ${product.name}</p>
                <p><span>Descripción:</span> ${product.description}</p>
                <p><span>Precio:</span> $${product.price}</p>
                <p><span>Stock:</span> ${product.stock}</p>
                <p><span>Categoría:</span> ${product.category}</p>
                <button class="add-to-cart" data-id="${product.id}">Agregar al carrito</button>
            </div>
        </div>`;
        paginationContainer.innerHTML += productHTML; // Insertar el HTML generado en el contenedor
    });

    // Agregar eventos a los botones "Agregar al carrito"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
}

function handleAddToCart(productId) {
    console.log(`Producto agregado al carrito: ${productId}`);
    // Lógica para agregar al carrito
}
//-----------------------------------

// Función para renderizar los controles de paginación
function renderPagination(totalPages, page) {
    // paginationContainer.innerHTML = ''; // Limpiar los controles de paginación

    // Botón de página anterior
    if (page > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.addEventListener('click', () => loadPage(page - 1));
        paginationContainer.appendChild(prevButton);
    }

    // Mostrar la página actual
    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Página ${page} de ${totalPages}`;
    paginationContainer.appendChild(pageInfo);

    // Botón de página siguiente
    if (page < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Siguiente';
        nextButton.addEventListener('click', () => loadPage(page + 1));
        paginationContainer.appendChild(nextButton);
    }
}

//------------------------------------
function loadPage(page) {
    // Obtener los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const limit = params.get('limit') || 10;  // Obtener el parámetro 'limit' de la URL (si no existe, por defecto es 10)
    const sort = params.get('sort') || null;  // Obtener el parámetro 'sort' de la URL
    const query = params.get('query') || null;  // Obtener el parámetro 'query' de la URL

    console.log("ESTE ES query:", query);

    // Construir la URL para la llamada a la API
    let apiUrl = `/api/products?page=${page}&limit=${limit}`;
    if (sort) apiUrl += `&sort=${sort}`;
    if (query) apiUrl += `&query=${query}`;

    // Llamada a la API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Productos obtenidos:", data);

            // Renderizar los datos recibidos
            renderProducts(data.payload);
            renderPagination(data.totalPages, page);

            // Actualizar la página actual en la URL (sin recargar)
            window.history.pushState({}, '', `?page=${page}&limit=${limit}&sort=${sort || ''}&query=${query || ''}`);

            // Actualizar la variable currentPage con el nuevo valor
            currentPage = page;
        })
        .catch(error => console.error("Error al cargar los productos:", error));
}

// Cargar productos al cargar la página inicial
loadPage(currentPage);





