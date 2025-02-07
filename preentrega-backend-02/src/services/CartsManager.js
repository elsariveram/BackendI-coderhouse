
import { create } from 'domain';
import fs from 'fs/promises';
import path from 'path';
import __dirname from '../utils.js';

import { cartModel } from '../models/carritos.model.js';
import { productModel } from '../models/productos.model.js';

const carritosFilePath = path.resolve('data', 'carritos.json');

console.log(carritosFilePath); 
export default class CartManager {
    

    
     //**METODOS**

    async saveToFile() { //ANTIGUO--------ELIMINAR-----------------
        const jasonData = JSON.stringify(this.carts, null, 2);
        await fs.writeFile(carritosFilePath, jasonData);
    }



// para CREAR un carrito _ POST /

async createCart(cart) { ///----------------------------------LISTO NUEVO
    // Validar que cart es un array
    if (!Array.isArray(cart)) {
        throw new Error("El carro debe ser un array de productos.");
    }

     // Validar que los elementos del array tienen las propiedades necesarias
     const isValid = cart.every(
        (item) => item.id && typeof item.id === 'string' && typeof item.quantity === 'number' && item.quantity > 0
    );
    
      
      if (!isValid) {
        throw new Error("Error: cada producto debería tener un id válido y una cantidad.");
      }

    const newCart = {
       
        products: [...cart],

    }
    console.log("Carrito creado AQUI-----:", newCart);
    try {
        await cartModel.create(newCart);
        console.log("Carrito creado:", newCart);
    } catch (error) {
        console.log("Error al crear el carrito:",error);
        throw error; // Lanza el error para que pueda manejarse en otro nivel
    }
    
    return newCart;
}


//ruta para LISTAR los productos que pertenezcan al carrito_ GET /:cid 


async getProductsByCartId(cartId) { //LISTO------NUEVO------LISTO-----------
    
    try {
        // Busca el carrito directamente en la base de datos
        const products = await productModel.find().exec();
        const cart = await cartModel.findOne({ _id: cartId }).populate({
            path: 'products.id',
            select: 'name description price stock category ',
          });
        console.log("Carrito encontrado AQUI:", cart.products);
        console.log('Productos:', cart?.products?.map(item => item.id));
        

        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        // Devuelve los productos del carrito
        return cart.products.map(product => ({
            id: product.id._id, // Asegúrate de que sea el `_id` del producto
            name: product.id.name, // Otros datos del producto
            description: product.id.description,
            price: product.id.price,
            stock: product.id.stock,
            quantity: product.quantity
        }));
        // return cart.products;
    } catch (error) {
        // Manejo de errores
        console.error("Error al obtener los productos del carrito:", error.message);
        throw error;
    }
   
}

// ruta para agregar un producto al arreglo “products” del carrito seleccionado,  _  POST  /:cid/product/:pid 

async addProductToCart(cartId, productId, quantity) {

    try {
        // Verificar si el producto existe en la base de datos
        const productExists = await productModel.findById(productId);
        if (!productExists) {
            throw new Error("Producto no encontrado");
        }

        // Busca el carrito directamente en la base de datos
        const cart = await cartModel.findOne({ _id: cartId });

        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        // Busca si el producto ya existe en el carrito
        const productIndex = cart.products.findIndex(product => product.id.equals(productId));
        

        if (productIndex !== -1) {
            // Si el producto ya existe, incrementa la cantidad
            cart.products[productIndex].quantity += quantity;
        } else {
            // Si el producto no existe, agrégalo al array de productos
            cart.products.push({ id: productId, quantity: quantity });
        }

        // Guarda los cambios en la base de datos
        await cart.save();

        return cart; // Retorna el carrito actualizado
    } catch (error) {
        console.log("Error al agregar producto al carrito:", error.message);
        throw new Error("Error al agregar producto al carrito: " + error.message);
    }

   
}
// En CartManager.js

    // Método para eliminar todos los productos de un carrito
    async clearCart(cartId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                return null; // Retorna null si no encuentra el carrito
            }
            cart.products = []; // Vacía el arreglo de productos
            await cart.save(); // Guarda los cambios en la base de datos
            return cart; // Retorna el carrito actualizado
        } catch (error) {
            throw new Error(`Error al vaciar el carrito: ${error.message}`);
        }
    
}

//para eliminar un producto de un carrito
async removeProductFromCart(cartId, productId) {
    try {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return null; // Retorna null si no encuentra el carrito
        }
        // Filtra los productos manteniendo solo los que no coincidan con el ID proporcionado
        cart.products = cart.products.filter(product => product.id.toString() !== productId);
        await cart.save(); // Guarda los cambios
        return cart; // Retorna el carrito actualizado
    } catch (error) {
        throw new Error(`Error al eliminar el producto del carrito: ${error.message}`);
    }
}

//actualiza el carrito con un nuevo arreglo de productos.
async updateCart(cartId, products) {
    try {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return null; // Retorna null si no encuentra el carrito
        }
        cart.products = products; // Reemplaza los productos existentes
        await cart.save(); // Guarda los cambios
        return cart; // Retorna el carrito actualizado
    } catch (error) {
        throw new Error(`Error al actualizar el carrito: ${error.message}`);
    }
}

//Actualizar solo la cantidad de un producto.
async updateProductQuantity(cartId, productId, quantity) {
    try {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return null; // si no se encuentra el carrito
        }
        const product = cart.products.find(p => p.id.toString() === productId);
        if (!product) {
            return null; //  si no encuentra el producto
        }
        product.quantity = quantity; // Actualiza la cantidad
        await cart.save(); 
        return cart; // Retorna el carrito actualizado
    } catch (error) {
        throw new Error(`Error al actualizar la cantidad del producto: ${error.message}`);
    }
}


}