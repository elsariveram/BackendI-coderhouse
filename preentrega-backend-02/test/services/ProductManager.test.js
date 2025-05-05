// test/productManager.test.js


import assert from 'node:assert';
import ProductManager from '../../src/services/ProductManager.js'; 
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();


// Conectar a MongoDB antes de que se corran los tests
before(async function () {
    try {
      await mongoose.connect(process.env.URL_MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log("Conectado a MongoDB para pruebas");
    } catch (error) {
      console.error("Error al conectar a MongoDB:", error);
    }

    

  });
  
  // Desconectar después de que todos los tests hayan corrido
  after(async function () {
    try {
      await mongoose.connection.close();
      console.log("Desconectado de MongoDB después de pruebas");
    } catch (error) {
      console.error("Error al desconectar MongoDB:", error);
    }
  });

const productManager = new ProductManager(); 

let createdProductId; 


describe('ProductManager', () => {
    describe('getAllProducts', () => {
        it('debe retornar un array de productos según los filtros', async function () {

            this.timeout(5000);

            const limit = 10;
            const skip = 0;
            const filter = {};
            const sort = {};

            const resultado = await productManager.getAllProducts(limit, skip, filter, sort);

            assert.ok(Array.isArray(resultado), 'El resultado debe ser un array');
            assert.ok(resultado.length <= limit, `Debe tener máximo ${limit} productos`);

        });
    });

    
  describe('addProduct()', () => {
    it('debería crear un nuevo producto', async () => {
      const product = {
        _id: new mongoose.Types.ObjectId().toString(),
        title: 'Producto Test',
        name: "Nomnbre test",
        description: 'Descripción test',
        price: 100,
        category: 'Test',
        stock: 5
      };

      const result = await productManager.addProduct(product);
      assert.ok(result._id, 'El producto debe tener un _id');
      assert.strictEqual(result.title, product.title, 'El título del producto no coincide');
      createdProductId = result._id;
    });
  });

  describe('getProductById()', () => {
    it('debería obtener un producto por ID', async () => {
      const product = await productManager.getProductById(createdProductId);
      assert.ok(product, 'El producto no debe ser null');
      assert.strictEqual(product._id.toString(), createdProductId, 'El ID del producto no coincide');
    });
  });

  describe('getAllProducts()', () => {
    it('debería retornar un array de productos', async () => {
      const productos = await productManager.getAllProducts(10, 0, {}, {});
      assert.ok(Array.isArray(productos), 'Debe ser un array');
      assert.ok(productos.length > 0, 'El array debe tener al menos un producto');

    });
  });

  describe('updateProduct()', () => {
    it('debería actualizar los campos del producto', async () => {
      const updates = { price: 150 };
      const result = await productManager.updateProduct(createdProductId, updates);
      assert.strictEqual(result.modifiedCount, 1, 'Debe modificar un producto');

      const updated = await productManager.getProductById(createdProductId);
      assert.strictEqual(updated.price, 150, 'El precio debe haberse actualizado a 150');
    });
  });

  describe('getProductCount()', () => {
    it('debería contar los productos existentes', async () => {
      const count = await productManager.getProductCount({});
      assert.strictEqual(typeof count, 'number', 'El conteo debe ser un número');
      assert.ok(count > 0, 'Debe haber al menos un producto');
    });
  });

  describe('deleteProduct()', () => {
    it('debería eliminar el producto por ID', async () => {
      const result = await productManager.deleteProduct(createdProductId);

      const deleted = await productManager.getProductById(createdProductId);
      assert.strictEqual(deleted, null, 'El producto debe ser null tras la eliminación');
    });
  });




});
