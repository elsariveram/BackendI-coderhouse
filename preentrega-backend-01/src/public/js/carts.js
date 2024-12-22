// Obtener el `cid` de la URL
const pathSegments = window.location.pathname.split('/');
console.log("Estos son los pathSegments", pathSegments);
const cid = pathSegments.includes('carts') ? pathSegments[pathSegments.indexOf('carts') + 1] : null;
console.log("Este es el cid recibido", cid);


// Referencia al contenedor donde se mostrarán los datos
const cartContainer = document.getElementById('cart-container');

// Función para cargar los datos del carrito
async function loadCart() {
    try {
        const response = await fetch(`/api/carts/${cid}`);
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const cartData = await response.json();
        console.log("Datos del carrito desde la API:", cartData);

        // Renderizar los datos del carrito
        renderCart(cartData);
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
        cartContainer.innerHTML = `<p>Error al cargar el carrito.</p>`;
    }
}

// Función para renderizar los datos del carrito
function renderCart(cart) {
    console.log("Cart data:", cart);

    // Verificar si el array está vacío
    if (!Array.isArray(cart) || cart.length === 0) {
        cartContainer.innerHTML = '<p>El carrito está vacío.</p>';
        return;
    }

    // Generar el HTML para cada producto en el carrito
    const cartHTML = cart
        .map(
            (product) => `
            <div class="product">
                <p>Producto</p>
                <p>ID: ${product.id}</p>
                <p>Nombre: ${product.name}</p>
                <p>descripción: ${product.description}</p>
                <p> stock disponible: ${product.stock}</p>
                <p>Precio unitario: ${product.price}</p>
                <p>Cantidad en el carrito: ${product.quantity} unidades</p>
                
            </div>
            <br>
            <br>    
        `
        )
        
        .join('');
        console.log ("Esto es cartHTML", cartHTML)
    // Insertar el HTML en el contenedor
    cartContainer.innerHTML = `
        <h2>Productos en el carrito: ${cid}</h2>
        ${cartHTML}
    `;
}

// Cargar los datos del carrito al cargar la página
loadCart();
