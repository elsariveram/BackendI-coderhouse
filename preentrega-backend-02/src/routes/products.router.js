// import express from 'express';
import ProductManager from '../services/ProductManager.js';
import express, { Router } from 'express';
import { authorization } from '../config/middlewares.js';

  //  router para productos
    const router = Router();
  //importar una clase manager
    const productManager = new ProductManager();


//TODAS LAS APIS------------------------

// Ruta para listar  todos los productos 
//ejemplo: http://localhost:8080/api/products?limit=1
router.get('/', async (req, res) => {

  try {
      // Obtener los parámetros de la query
      
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      console.log("limit",req.query.limit)
      const page = req.query.page ? parseInt(req.query.page) : 1;
      console.log("page",req.query.page)
      const sort = req.query.sort === 'asc' ? { price: 1 } : req.query.sort === 'desc' ? { price: -1 } : {};
      console.log("sort",req.query.sort)
      const query = req.query.query || ''; // Filtro por categoría o disponibilidad
      console.log("query",req.query.query)

      // Calcular el número de productos a omitir según la página
      const skip = (page - 1) * limit;

      // Filtro para buscar por query (por categoría o disponibilidad)
      let filter = {};
      if (query) {
          filter = {
              $or: [
                  { category: query },  // Filtrar por categoría
                  { availability: query }  // Filtrar por disponibilidad
              ]
          };
      }

      // Obtener los productos con el filtro y ordenamiento aplicados
      const products = await productManager.getAllProducts(limit, skip, filter, sort);

      // Obtener el total de productos para calcular el total de páginas
      const totalProducts = await productManager.getProductCount(filter);
      const totalPages = Math.ceil(totalProducts / limit);

      // Determinar si existen páginas anteriores o siguientes
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      // Calcular las páginas anteriores y siguientes
      const prevPage = hasPrevPage ? page - 1 : null;
      const nextPage = hasNextPage ? page + 1 : null;

      // Construir los enlaces de las páginas
      const prevLink = hasPrevPage ? `/products?page=${prevPage}&limit=${limit}` : null;
      const nextLink = hasNextPage ? `/products?page=${nextPage}&limit=${limit}` : null;

      // Devolver la respuesta con la estructura solicitada
      res.json({
          status: 'success',
          payload: products,
          totalPages,
          prevPage,
          nextPage,
          page,
          hasPrevPage,
          hasNextPage,
          prevLink,
          nextLink,
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});


// Ruta para obtener un producto por su ID.  ---
    router.get('/:pid', async (req, res) => {
      //(se usa _id string de mongoatlas)
      try {
        const productId= req.params.pid;
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

//ruta para crear un producto     -----LISTO NUEVO
    router.post('/', authorization("admin"), async (req, res) => {
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

//ruta para actualizar un producto por id  -----LISTO NUEVO
    router.put('/:pid', authorization("admin"), async (req, res) => {
      try {
        const productId= req.params.pid;
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
    router.delete('/:pid', authorization("admin"),  async (req, res) => {
      try {
        const productId= req.params.pid;
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
