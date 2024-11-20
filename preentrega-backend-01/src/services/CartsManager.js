import { create } from 'domain';
import fs from 'fs/promises';
import path from 'path';

const carritosFilePath = path.resolve('data', 'carritos.json');

export default class CartManager {
    //constructor
    constructor() {
        this.carts = [];
        this.init();
    }

    async init() {
        try {
            const data = await fs.readFile(carritosFilePath, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            this.carts = [];
        }
    }
     //**METODOS**

    async saveToFile() {
        const jasonData = JSON.stringify(this.carts, null, 2);
        await fs.writeFile(carritosFilePath, jasonData);
    }



// para CREAR un carrito _ POST /

async createCart(cart) {
    // Validar que cart es un array
    if (!Array.isArray(cart)) {
        throw new Error("El carro debe ser un array de productos.");
    }

     // Validar que los elementos del array tienen las propiedades necesarias
     const isValid = cart.every(
        (item) => item.id && typeof item.quantity === 'number' && item.quantity > 0
    );

    if (!isValid) {
        throw new Error("cada producto deberia tener un id valido y una cantidad.");
    }

    const newCart = {
        cartid: this.carts.length ? this.carts[this.carts.length - 1].cartid + 1 : 1,
        products: [...cart]
    }
    this.carts.push(newCart);
    await this.saveToFile();
    return newCart;
}


//ruta para LISTAR los productos que pertenezcan al carrito_ GET /:cid 

async getProductsByCartId(cartId) {
    const cart = this.carts.find(cart => cart.cartid === cartId);
    if (!cart) {
        throw new Error("Carrito no encontrado");
    }
    return cart.products;
}

// ruta para agregar el producto al arreglo “products” del carrito seleccionado,  _  POST  /:cid/product/:pid 

async addProductToCart(cartId, productId, quantity) {

    const cart = this.carts.find(cart => cart.cartid === cartId);
    if (!cart) {
        throw new Error("Carrito no encontrado");
    }
    const product = cart.products.find(product => product.id === productId);
    //si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto. 
    if (product) {
        product.quantity += quantity; 
    } else {
        cart.products.push({ id: productId, quantity: quantity });
    }
    // Guardar cambios en archivo y manejar errores
    try {
        await this.saveToFile();
    } catch (error) {
        throw new Error("Error al guardar los cambios en el archivo: " + error.message);
    }
    return cart;
}

}