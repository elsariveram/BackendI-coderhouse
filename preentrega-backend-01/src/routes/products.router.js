// import express from 'express';
import ProductManager from '../services/ProductManager.js';
import express, { Router } from 'express';

  //  router para productos
    const router = Router();
  //importar una clase manager
    const productManager = new ProductManager();


//TODAS LAS APIS------------------------

// Ruta para listar  todos los productos 
//http://localhost:8080/api/products?limit=1
    router.get('/', async(req, res) => {
     
      try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getAllProducts(limit);
        res.json(products);
      }
      catch (error) {
        console.log(error);
      }
      
    });

// Ruta para obtener un producto por su ID. 
    router.get('/:pid', async (req, res) => {
      
      try {
        const productId= parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);
        if (product === null) {
          return res.status(404).send('Producto no encontrado');
        }
        res.json(product);
      }
      catch (error) {
        console.log(error);
      }
      
       });

//ruta para crear un producto
    router.post('/', async (req, res) => {
      try {
        const { title, name, description, code, price, stock, category, thumbnails } = req.body;
        if ( !title || !name || !description || !code || !price || !stock || !category) {
          return res.status(400).json({error: 'Todos los campos son obligatorios'});
        }
        const newProduct = await productManager.addProduct({ title, name, description, code, price, stock, category, thumbnails });

        res.status(201).json(newProduct);

      } catch (error) {
        console.log(error);
        
      }
    });

//ruta para actualizar un producto por id
    router.put('/:pid', async (req, res) => {
      try {
        const productId= parseInt(req.params.pid);
        const updatedProduct = await productManager.updateProduct(productId, req.body);
        if (updatedProduct) {
          res.json(updatedProduct);
        } else {
          res.status(404).json({error: 'Producto no encontrado'});
        }
      } catch (error) {
        console.log(error);
      }
    });

//ruta para eliminar un producto
    router.delete('/:pid', async (req, res) => {
      try {
        const productId= parseInt(req.params.pid);
        const deletedProduct = await productManager.deleteProduct(productId);
        if (deletedProduct) {
          res.json(deletedProduct);
        } else {
          res.status(404).json({error: 'Producto no encontrado'});
        }
      } catch (error) {
        console.log(error);
      }
    });

export default router;
