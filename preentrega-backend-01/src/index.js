import express from "express";
import handlebars from 'express-handlebars';
import __dirname from "./utils.js";
//socket y ruta
import { Server } from 'socket.io';
import viewRouter from './routes/views.router.js'
// Rutas de productos y carrito
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";


//declaramos express y asignamos el puerto
const app = express();
const PORT = 8080;


// parseo de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Confi de HBs------------------------------------
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + "/views");
app.set("view engine", "handlebars");
//indicamos al server que el directorio public es publico
app.use(express.static(__dirname + "/public"))
//-------------------------------------------------

// routers de productos y carritos
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter); 
app.use('/', viewRouter) 

const httpServer = app.listen(PORT, () => {
    console.log(`Server run on port: ${PORT}`);
})


//ejemplo para el carrito
const carts =[
    {
        cartid: 1,
        products: [],
    },
    {
        cartid: 2,
        products: [
            { id: 1, quantity: 3 },
            { id: 3, quantity: 1},  
        ],
    },
]
//------------------------------------------------
// app.get('/ping', (req, res) => {
//     res.render("realtimeproducts")
// })


// Abrimos el canal de comunicacion del lado del server

const socketServer = new Server(httpServer)

async function fetchProducts() {
    //esto podria ser una funcion asincrona externa que actualiza la data
    try {
        // Hacer un fetch a la ruta del router de productos
        const response = await fetch('http://localhost:8080/api/products', { 
            method: 'GET',
            headers: {
                 'Content-Type': 'application/json'
             }
         });
        
        if (!response.ok) {
            throw new Error('Error al obtener los productos');
        }
        
        const products = await response.json();

        if (!Array.isArray(products)) {
            products = [products];  
        }
        
        console.log("Productos a ARRAY:", products);
        // Emitir los productos al cliente
        socketServer.emit('ingreso-producto', products);

    } catch (error) {
        console.error("Error al obtener productos:", error);
    }
    }

socketServer.on('connection', socket => {
    console.log("Nuevo cliente conectado");

    socket.on('prueba', async(data) => {  //socket  de ingreso de px
        console.log("Recibido actualizar producto", data);

        fetchProducts();
    })

    
    socket.on('eliminar-producto', async(data) => {  //socket  de eliminacion de px
        console.log("Recibido eliminar producto", data);
        fetchProducts();
    })
})
