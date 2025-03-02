
import { create } from 'domain';
import fs from 'fs/promises';
import path from 'path';
import __dirname from '../utils.js';

import { cartModel } from '../models/carritos.model.js';
import { productModel } from '../models/productos.model.js';
import ticketModel from '../models/ticket.model.js';


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

        //     //REVISAR SI SIRVE... SINO USAR return cart;
        // return {
        //     cart,
        //     products: cart.products.map(product => ({
        //         id: product.id._id,
        //         name: product.id.name,
        //         description: product.id.description,
        //         price: product.id.price,
        //         stock: product.id.stock,
        //         quantity: product.quantity
        //     }))
        // };
        // // Devuelve los productos del carrito
        // return cart.products.map(product => ({
        //     id: product.id._id, // Asegúrate de que sea el `_id` del producto
        //     name: product.id.name, // Otros datos del producto
        //     description: product.id.description,
        //     price: product.id.price,
        //     stock: product.id.stock,
        //     quantity: product.quantity
        // }));
        
        // // return cart.products;
        return cart;
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

// CHECKOUT CARRITO!!!---------------------------------

export const checkout = async (req, res) => {
    try {
        const cartId = req.params.cid; 
        const cart = await cartModel.findById(cartId); 
        const prodSinStock = []; 

        if (!cart) {
            return res.status(404).send({ message: "Carrito no encontrado" });
        }

        // Verificar stock
        for (const prod of cart.products) {
            console.log(`Verificando producto en el carrito:`, prod); // Ver qué datos tiene cada producto

            let producto = await productModel.findById(prod.id);//prod.id_prod
            if (!producto) {
                console.error(`❌ Error: Producto con ID ${prod.id_prod} no encontrado`);//prod.id_prod
                return res.status(404).send({ error: `Producto con ID ${prod.id_prod} no encontrado` }); //prod.id_prod
            }
            console.log(`✅ Producto encontrado:`, producto);
            if (producto.stock - prod.quantity < 0) {
                prodSinStock.push(prod.id);
                console.log(`❌ Producto sin stock encontrado:`, prodSinStock);
            }
        }

        // Si todos los productos tienen stock, continuar con la compra
        if (prodSinStock.length === 0) {
            let totalAmount = 0;

            // Descontar stock y calcular total
            for (const prod of cart.products) {
                let producto = await productModel.findById(prod.id);//prod.id_prod
                producto.stock -= prod.quantity;
                await producto.save();
                totalAmount += prod.quantity * producto.price;
            }

            // Crear ticket
            const newTicket = await ticketModel.create({
                code: crypto.randomUUID(),
                purchaser: req.user.email,
                amount: totalAmount,
                products: cart.products
            });

            // Vaciar carrito
            await cartModel.findByIdAndUpdate(cartId, { products: [] });

            // Enviar ticket
            return res.status(200).send(newTicket);
        }

        console.log("Productos sin stock:", prodSinStock)
        // Si hay productos sin stock, eliminarlos del carrito
        cart.products = cart.products.filter(prod => !prodSinStock.includes(prod.id)); // prod.id_prod
        await cartModel.findByIdAndUpdate(cartId, { products: cart.products });

        // Mostrar productos sin stock al usuario
        return res.status(200).send({ message: "Algunos productos no tienen stock", prodSinStock });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error al realizar el checkout" });
    }
};



// export const checkout = async (req, res) => {
//     try {
//         const cartId = req.params.cid; //obtengo el id del carrito
//         const cart = await cartModel.findById(cartId); //busco el carrito
//         const prodSinStock = []; //array para guardar los productos sin stock

//         if (cart) {
//             //ver si todos los productos tienen stock suficiente
//             cart.products.forEach(async (prod) => {
//                 let producto = await productModel.findById(prod.id_prod);
//                 if (producto.stock - prod.quantity < 0) {
//                     prodSinStock.push(producto.id);
//                 }
//             })
//             // FINALIZO COMPRA si todos los productos tienen stock suficiente
//             if (prodSinStock.length === 0) { 
//                 let totalAmount=0;
//                 // descuento el stock de cada px y calculo total de compra
//                 cart.products.forEach(async(prod) => {
//                     let producto = await productModel.findById(prod.id_prod);
//                     producto.stock = producto.stock - prod.quantity;
//                     await producto.save();
//                     totalAmount +=  prod.quantity * producto.price;   
//                 })

//                //creo el ticket
//                 const newTicket = await ticketModel.create({
//                     code: crypto.randomUUID(),
//                     purchaser: req.user.email,
//                     amount: totalAmount,
//                     products: cart.products
//                 })
                 
//                 // vacio el carrito
//                 await cartModel.findByIdAndUpdate(cartId, {products: []});
//                 // envio el ticket
//                 res.status(200).send(newTicket);
//             }
//             else {
//                 // saco del carrito todos los px din stock
//                 prodSinStock.forEach((prodId) => {
//                     let indice = cart.products.findIndex(prod => prod.id_prod === prodId);
//                     cart.products.splice(indice, 1);        
//                 })
//                 // actualizo el carrito
//                 await cartModel.findByIdAndUpdate(cartId, {products: cart.products});
//                 // muestro los productos sin stock AL USUARIO
//                 res.status(200).send({message: prodSinStock});
//             }
//         } else {
//         return res.status(404).send({ message: "Carrito no encontrado" })
//         };
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({message: "Error al realizar el checkout"});
//     }
// }