import express from "express";
import __dirname from "./utils.js";
// Rutas de productos y carrito
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";

//declaramos express y asignamos el puerto
const app = express();

//middleware de CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = 8080;


// parseo de JSON
app.use(express.json());

app.use(express.urlencoded({ extended: true }));



// routers de productos y carritos
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter); 


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

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})