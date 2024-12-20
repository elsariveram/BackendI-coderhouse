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
        const cartId = String(req.params.cid);
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
        const cartId = req.params.cid;
        const productId =req.params.pid;
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

// Ruta para eliminar todos los productos de un carrito
router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const clearedCart = await cartManager.clearCart(cartId);
        if (!clearedCart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.json({ message: "Todos los productos han sido eliminados del carrito", cart: clearedCart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al eliminar los productos del carrito" });
    }
});

// Ruta para eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const updatedCart = await cartManager.removeProductFromCart(cartId, productId);
        if (!updatedCart) {
            return res.status(404).json({ error: "Carrito o producto no encontrado" });
        }
        res.json({ message: "Producto eliminado del carrito", cart: updatedCart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al eliminar el producto del carrito" });
    }
});

//actualiza el carrito con un nuevo arreglo de productos.-----------------------------------------
router.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const products = req.body.products; // Se espera un arreglo de productosen la solicitud
        if (!Array.isArray(products)) {
            return res.status(400).json({ error: "La solicitud debe ser un arreglo de productos" });
        }
        const updatedCart = await cartManager.updateCart(cartId, products);
        if (!updatedCart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.json({ message: "Carrito actualizado", cart: updatedCart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al actualizar el carrito" });
    }
});
////// Para actualizar solo la cantidad de un producto.
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = parseInt(req.body.quantity);
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ error: "La cantidad debe ser un número mayor a 0" });
        }
        const updatedCart = await cartManager.updateProductQuantity(cartId, productId, quantity);
        if (!updatedCart) {
            return res.status(404).json({ error: "Carrito o producto no encontrado" });
        }
        res.json({ message: "Cantidad del producto actualizada", cart: updatedCart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al actualizar la cantidad del producto" });
    }
});


export default router