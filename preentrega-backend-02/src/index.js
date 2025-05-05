//para swagger
import swaggerUiExpress from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

// para .env (guardar contraseñas y datos no publicos)
import "dotenv/config";
//
import express from "express";
import handlebars from 'express-handlebars';
import __dirname from "./utils.js";
//socket y ruta
import { Server } from 'socket.io';
import viewRouter from './routes/views.router.js'
// Rutas de productos y carrito
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";

//passport
import passport from 'passport';
import { initializePassport } from "./config/passport.config.js";

//ruta session
import sessionRouter from "./routes/sessions.routes.js";
// MOngoDB
import mongoose from 'mongoose';

import fileStore from 'session-file-store';

import mongoStore from 'connect-mongo';

import session, { Cookie } from 'express-session';
import e from "express";

import cookieParser from "cookie-parser";


//declaramos express y asignamos el puerto
const app = express();
const PORT = 8080;


// parseo de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookies
app.use(cookieParser(process.env.SECRET_COOKIE));

// // Rutas de cookies
// app.get("/set-cookie", (req, res) => {
//     res.cookie("nombre", "Juan Pérez", { maxAge: 900000, httpOnly: true });
//     res.send("Cookie creada!");
// });

// app.get("/get-cookie", (req, res) => {
//     res.send(req.cookies);
// });

// app.get("/delete-cookie", (req, res) => {
//     res.clearCookie("nombre");
//     res.send("Cookie eliminada!");
// });





//session
const fileStorage= new fileStore(session)
app.use(session({
    store: mongoStore.create({mongoUrl: 'mongodb+srv://elsariveramarchant:cGTNQdfXXYBZJrbP@cluster0.gakmh.mongodb.net/PrimeraBaseDatosMongoAtlas?retryWrites=true&w=majority&appName=Cluster0', ttl: 150000000, mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true}}),
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: true,
}))
//CONNECT MONGO DB



const connectMongoDB = async () => {
    try {
       await mongoose.connect(process.env.URL_MONGO);
       console.log("Conectado a la base de datos de Mongo Atlas");
    } catch (error) {
        console.log("Error al conectar a la base de datos:", error);
    };}

connectMongoDB();

//configuracion de swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Documentacion de la API",
            version: "1.0.0",
            description: "Documentacion de la API de Sessions para usuarios",
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
    
}

const specs = swaggerJsDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs)); //ruta swagger ApiDocs

//passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
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
app.use('/api/sessions', sessionRouter)



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



