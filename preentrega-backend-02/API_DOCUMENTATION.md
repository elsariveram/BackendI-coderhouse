
## Api - Sessions (usuarios) `/api/sessions`

La ruta base `/api/sessions` se encarga de gestionar la información relacionada con las sesiones de los usuarios. A través de esta ruta, se realizan acciones como la creación y gestión de sesiones de usuario, permitiendo así el acceso al sistema y la autenticación de los mismos.

### Documentación en Swagger
La documentación completa de esta ruta y sus métodos asociados está disponible en Swagger, donde puedes encontrar los detalles de cada uno de los endpoints, parámetros y respuestas posibles.

Esta documentación incluye, entre otras cosas:
- Información detallada sobre la creación de sesiones de usuario.
- Esquemas de las respuestas y las peticiones.
- Detalles sobre los códigos de estado HTTP devueltos por la API.


------------------------------------------------------------------------------------------------------------------------------
# 📦  API - Productos (`/api/products`)

Este endpoint maneja la logica para gestionar los productos exstistentes, su creación, edición, eliminación y listado completo.

**Base URL:** `http://localhost:8080/api/products`

---

## 📘 Endpoints

### 🔍 Obtener todos los productos

**GET** `/api/products`

#### Parámetros opcionales (`query`):

| Parámetro | Tipo    | Descripción                                | Valor por defecto |
|-----------|---------|--------------------------------------------|-------------------|
| limit     | Número  | Cantidad de productos por página           | 10                |
| page      | Número  | Página a mostrar                           | 1                 |
| sort      | String  | Ordenar por precio (`asc` o `desc`)        | ninguno           |
| query     | String  | Filtro por categoría o disponibilidad      | ninguno           |

#### Ejemplo:
```
GET /api/products?limit=5&page=2&sort=asc&query=electronics
```

#### Respuesta:
```json
{
  "status": "success",
  "payload": [ ... ],
  "totalPages": 5,
  "prevPage": 1,
  "nextPage": 3,
  "page": 2,
  "hasPrevPage": true,
  "hasNextPage": true,
  "prevLink": "/products?page=1&limit=5",
  "nextLink": "/products?page=3&limit=5"
}
```

---

### 🔎 Obtener un producto por ID

**GET** `/api/products/:pid`

#### Parámetro:
- `:pid` → ID del producto (MongoDB)

#### Ejemplo:
```
GET /api/products/652abcd12345678
```

#### Respuesta (200):
```json
{
  "_id": "652abcd12345678",
  "title": "Producto 1",
  "price": 100,
  ...
}
```

#### Respuesta (404):
```json
{
  "error": "Producto no encontrado"
}
```

---

### ➕ Crear un nuevo producto

**POST** `/api/products`

> 🛑 Requiere autorización de tipo `admin`.

#### Body (JSON):
```json
{
  "title": "Nombre del producto",
  "name": "Nombre alternativo",
  "description": "Descripción del producto",
  "code": "COD123",
  "price": 100,
  "stock": 20,
  "category": "Electrónica",
  "thumbnails": ["imagen1.jpg", "imagen2.jpg"]
}
```

#### Respuesta (201):
```json
{
  "_id": "...",
  "title": "...",
  ...
}
```

#### Errores (400):
```json
{
  "error": "Todos los campos son obligatorios"
}
```

---

### ✏️ Actualizar un producto

**PUT** `/api/products/:pid`

> 🛑 Requiere autorización de tipo `admin`.

#### Parámetro:
- `:pid` → ID del producto

#### Body (JSON):
```json
{
  "price": 120,
  "stock": 15
}
```

#### Respuesta (200):
```json
{
  "_id": "...",
  "price": 120,
  ...
}
```

#### Respuesta (404):
```json
{
  "error": "Producto no encontrado"
}
```

---

### 🗑️ Eliminar un producto

**DELETE** `/api/products/:pid`

> 🛑 Requiere autorización de tipo `admin`.

#### Parámetro:
- `:pid` → ID del producto

#### Respuesta (200):
```json
{
  "deleted": true,
  "_id": "..."
}
```

#### Respuesta (404):
```json
{
  "error": "Producto no encontrado"
}
```

---

## 🔒 Autorización

Las siguientes rutas requieren rol `admin`:
- POST `/api/products`
- PUT `/api/products/:pid`
- DELETE `/api/products/:pid`

Asegúrate de que el middleware `authorization("admin")` esté correctamente configurado.

---

## ⚠️ Errores comunes

- **500 Internal Server Error**:
```json
{
  "status": "error",
  "message": "Internal server error"
}
```


---------------------------------------------------------------------------------------------------------------

#  🛒 API - Carritos (`/api/carts`)

Este endpoint maneja la lógica para gestionar carritos de compra en la aplicación.

## ➕Crear un carrito

**POST** `/api/carts/`  
**Auth:** user  
Crea un nuevo carrito.

- **Body (opcional)**: Información del carrito o usuario (según implementación interna).
- **Response:** `201 Created` con el carrito creado.

---

## 📄Obtener productos de un carrito

**GET** `/api/carts/:cid`  
Obtiene todos los productos asociados al carrito con ID `:cid`.

- **Response:** `200 OK` con los productos del carrito.
- **Error:** `404 Not Found` si no existe el carrito.

---

## 🛍️ Agregar producto a un carrito

**POST** `/api/carts/:cid/product/:pid`  
**Auth:** user  
Agrega un producto al carrito `:cid` con ID de producto `:pid`.

- **Body:**
```json
{
  "quantity": 2
}
```

- **Response:** `200 OK` con el producto agregado.
- **Error:** `400 Bad Request` si `quantity` es inválido.

---

## 🗑️ Eliminar todos los productos de un carrito

**DELETE** `/api/carts/:cid`  
**Auth:** user  
Elimina todos los productos del carrito `:cid`.

- **Response:** `200 OK` con mensaje de éxito.
- **Error:** `404 Not Found` si no existe el carrito.

---

## ❌ 📦 Eliminar un producto específico del carrito

**DELETE** `/api/carts/:cid/products/:pid`  
**Auth:** user  
Elimina el producto con ID `:pid` del carrito `:cid`.

- **Response:** `200 OK` con el carrito actualizado.
- **Error:** `404 Not Found` si no existe el carrito o producto.

---

## 🔄 🛒 Actualizar todo el carrito

**PUT** `/api/carts/:cid`  
**Auth:** user  
Reemplaza los productos del carrito con un nuevo arreglo.

- **Body:**
```json
{
  "products": [
    { "productId": "xxx", "quantity": 1 },
    ...
  ]
}
```

- **Response:** `200 OK` con el carrito actualizado.
- **Error:** `400 Bad Request` si el body no es un arreglo válido.

---

## ✏️ 📦 Actualizar solo la cantidad de un producto

**PUT** `/api/carts/:cid/products/:pid`  
**Auth:** user  
Actualiza la cantidad del producto `:pid` dentro del carrito `:cid`.

- **Body:**
```json
{
  "quantity": 3
}
```

- **Response:** `200 OK` con el carrito actualizado.
- **Error:** `400 Bad Request` si `quantity` es inválido.

---

## ✅ 💳 Finalizar compra (Checkout)

**POST** `/api/carts/:cid/checkout`  
**Auth:** user  
Finaliza la compra de los productos del carrito. Si hay stock suficiente para todos los productos, se genera un ticket, se descuenta el stock y se vacía el carrito. Si hay productos sin stock, se eliminan del carrito y se informa al usuario.

**Parámetros de ruta**:
- `cid`: ID del carrito.

**Respuesta exitosa (`200 OK`)**:
- Si todos los productos tienen stock:
```json
{
  "code": "uuid-generado",
  "purchaser": "correo@usuario.com",
  "amount": 123.45,
  "products": [ ... ]
}
```
- Si hay productos sin stock:
```json
{
  "message": "Algunos productos no tienen stock",
  "prodSinStock": ["productId1", "productId2"]
}
```

**Errores**:
- `404 Not Found`: Si el carrito o algún producto no existe.
- `500 Internal Server Error`: Si ocurre un error durante el proceso.


--------------------------------------------------------------------------------------------------------------------

Claro, puedo documentar esta ruta de la misma manera, resaltando el propósito general y explicando las variaciones que maneja, como lo que corresponde a las vistas renderizadas. Aquí te dejo un ejemplo de documentación para la ruta `app.use('/', viewRouter)`:

---

### Ruta Base: **`/`** - Vista del Frontend Renderizada con Handlebars

La ruta base utiliza el **`viewRouter`** para manejar las vistas del frontend, renderizadas con el motor de plantillas **Handlebars**. Estas rutas sirven para renderizar páginas HTML dinámicas para la interacción con el usuario. A continuación se describen las rutas dentro de **`/`** que renderizan distintas vistas:

#### Rutas:

* **`GET /`**:

  * Renderiza la vista de inicio de la aplicación (`index`).
  * **Función**: Proporciona la pantalla principal o la página de bienvenida de la aplicación.

* **`GET /realtimeproducts`**:

  * Renderiza la vista que muestra productos en tiempo real (`realtimeproducts`).
  * **Función**: Muestra productos disponibles en tiempo real, actualizados dinámicamente.

* **`GET /products`**:

  * Renderiza la vista de todos los productos (`productos`).
  * **Función**: Muestra una lista de productos disponibles en la tienda.

* **`GET /carts/:cid`**:

  * Renderiza la vista de los carritos de compras para un carrito específico (`carritos`).
  * **Función**: Muestra el carrito de compras de un usuario específico mediante el ID del carrito (`cid`).

* **`GET /register`**:

  * Renderiza la vista de registro de usuario (`register`).
  * **Función**: Permite a un nuevo usuario registrarse en la aplicación.

* **`GET /login`**:

  * Renderiza la vista de inicio de sesión de usuario (`login`).
  * **Función**: Permite a un usuario autenticado acceder a la aplicación mediante credenciales.

#### Resumen:

Estas rutas están configuradas bajo **`/`**, utilizando **Handlebars** para renderizar las vistas correspondientes. Se centran en la presentación y la interacción con el usuario, cubriendo páginas de inicio, productos, carrito de compras y autenticación de usuarios (registro e inicio de sesión).

----------------------------------------------------------------------------------------------
