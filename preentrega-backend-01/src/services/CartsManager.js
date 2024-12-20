
//HACER: VER VIDEO EXPLICATIVO PARA ENTENDER LOS REQUERIMIENTOS NUEVOS DEL CARRITO. Y HACER UN EXCEL PARA TODOS LOS PUNTOS
        //POR EJEMPLO ESTO: Esta vez, para el modelo de Carts, en su propiedad products, el id de cada producto generado dentro del array tiene que hacer referencia al modelo de Products. Modificar la ruta /:cid para que al traer todos los productos, los traiga completos mediante un “populate”. De esta manera almacenamos sólo el Id, pero al solicitarlo podemos desglosar los productos asociados.
 
        //datos explicados por chat gpt, continuar viendo: https://chatgpt.com/share/6760f111-3e18-8001-9abb-8bdc51c6206c

import { create } from 'domain';
import fs from 'fs/promises';
import path from 'path';
import __dirname from '../utils.js';

import { cartModel } from '../models/carritos.model.js';
import { productModel } from '../models/productos.model.js';

const carritosFilePath = path.resolve('data', 'carritos.json');

console.log(carritosFilePath); 
export default class CartManager {
    //constructor
    constructor() {
        this.carts = []; //ANTIGUO--------ELIMINAR
        this.cartsAtlas = [];
        this.init();
    }

    async init() {
        ////// NUEVO---- LISTO
        try {
            // obtiene todos los carritos de la base de datos
            this.cartsAtlas = await cartModel.find();
            // console.log("Carritos de la base de datos de MongoAtlas:", this.cartsAtlas);
            console.log("Carritos de la base de datos de MongoAtlas Adquirida", );
        }
        catch (error) {
            this.cartsAtlas = [];
            console.log("Error al obtener los carritos de la base de datos MongoAtlas:", error);
            throw error; // Lanza el error para que pueda manejarse en otro nivel
        }

///////////////////////////////////// ANTIGUO--------ELIMINAR:
        try {
            const data = await fs.readFile(carritosFilePath, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            this.carts = [];
        }
    }
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
        // cartid: this.cartsAtlas.length ? this.cartsAtlas[this.cartsAtlas.length - 1].cartid + 1 : 1,
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
    // this.carts.push(newCart);
    // await this.saveToFile();
    return newCart;
}


//ruta para LISTAR los productos que pertenezcan al carrito_ GET /:cid 

// async getProductsByCartId(cartId) {
//     try {
//         // Encuentra el carrito por su ID y usa populate para obtener los datos completos de los productos
//         const cart = await cartModel.findById(cartId); // "id" es el campo referenciado en el esquema de Cart

//         if (!cart) {
//             throw new Error("Carrito no encontrado");
//         }

//         // Retorna los productos del carrito con los datos completos
//         return cart.products;
//     } catch (error) {
//         console.error("Error al obtener los productos del carrito:", error);
//         throw new Error("Error al buscar el carrito");
//     }
// }
async getProductsByCartId(cartId) { //LISTO------NUEVO------LISTO-----------
    
    try {
        // Busca el carrito directamente en la base de datos
        const cart = await cartModel.findOne({ _id: cartId }).populate('products.id').lean();
        console.log("Carrito encontrado AQUI:", cart);

        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        // Devuelve los productos del carrito
        return cart.products.map(product => ({
            id: product.id._id, // Asegúrate de que sea el `_id` del producto
            name: product.id.name, // Otros datos del producto
            quantity: product.quantity
        }));
        // return cart.products;
    } catch (error) {
        // Manejo de errores
        console.error("Error al obtener los productos del carrito:", error.message);
        throw error;
    }
    // this.init();
    // const cart = this.cartsAtlas.find(cart => cart.id === cartId);
    
    // // const cart = this.carts.find(cart => cart.cartid === cartId);
    // if (!cart) {
    //     throw new Error("Carrito no encontrado");
    // }
    // return cart.products;
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

    ////////////////////////////
   
    // const cart = this.carts.find(cart => cart.cartid === cartId);
    // if (!cart) {
    //     throw new Error("Carrito no encontrado");
    // }
    // const product = cart.products.find(product => product.id === productId);
    // //si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto. 
    // if (product) {
    //     product.quantity += quantity; 
    // } else {
    //     cart.products.push({ id: productId, quantity: quantity });
    // }
    // // Guardar cambios en archivo y manejar errores
    // try {
    //     await this.saveToFile();
    // } catch (error) {
    //     throw new Error("Error al guardar los cambios en el archivo: " + error.message);
    // }
    // return cart;
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