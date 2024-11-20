import express, { Router } from "express";
import CartManager from "../services/CartsManager.js";

    //router para carritos
    const router = Router();
    //importar una clase manager
    const cartManager = new CartManager();

//TODAS LAS APIS------------------------

//ruta para CREAR un carrito _ POST /
router.post('/', async (req, res) => {
    try {
       

        //crar carrito
        const newCart = await cartManager.createCart(req.body);
        res.status(201).json(newCart);
    } catch (error) {
        console.log(error);
    }
})


//ruta para LISTAR los productos que pertenezcan al carrito_ GET /:cid 

router.get('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const products = await cartManager.getProductsByCartId(cartId);
        if (!products) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.json(products);
    } catch (error) {
        console.log(error);
    }
});
// ruta para agregar el producto al arreglo “products” del carrito seleccionado,  _  POST  /:cid/product/:pid 

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const quantity = parseInt(req.body.quantity);
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ error: "La cantidad debe ser un número válido mayor a 0" });
        }

        const addedProduct = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(addedProduct);
    } catch (error) {
        console.log(error);
    }
})

export default router