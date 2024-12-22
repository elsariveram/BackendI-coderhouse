import fs from 'fs/promises';
import path from 'path';

import { productModel } from '../models/productos.model.js';


const productosFilePath = path.resolve( 'data', 'productos.json'); //borrar y probar

export default class ProductManager {

    //constructor
        constructor() {
            this.products = []; //ANTIGUO--------ELIMINAR
            // this.init();

                ////// NUEVO----
                this.productsAtlas = [];
                this.init();
           
        }

            async init() {
                ////// NUEVO----
                try {
                    // obtiene todos los productos de la base de datos
                    this.productsAtlas = await productModel.find();
                    // console.log("Productos de la base de datos de MongoAtlas:", this.productsAtlas);
                }
                catch (error) {
                    this.productsAtlas = [];
                    console.log("Error al obtener los productos de la base de datos MongoAtlas:", error);
                    throw error; // Lanza el error para que pueda manejarse en otro nivel
                }

///////////////////////////////////// ANTIGUO--------ELIMINAR
                try {
                    const data = await fs.readFile(productosFilePath, 'utf-8');
                    this.products = JSON.parse(data);
                } catch (error) {
                this.products = [];
                }
            }
    //**METODOS**

    //saveToFile  ANTIGUO--------ELIMINAR
    async saveToFile() {
        const jasonData = JSON.stringify(this.products, null, 2);
        await  fs.writeFile(productosFilePath, jasonData);
    }


    //getAllProducts
    async getAllProducts(limit, skip, filter, sort) {  // Recibe limit, skip (paginación), filter (filtros) y sort (ordenamiento)
        try {
            let query = filter || {}; // Si hay filtros, se usan; si no, la consulta es general
    
            // Construir la consulta base
            let queryBuilder = productModel.find(query).lean();
    
            // Aplicar el límite y la paginación si es necesario
            if (limit) {
                queryBuilder = queryBuilder.limit(limit);
            }
            if (skip) {
                queryBuilder = queryBuilder.skip(skip);
            }
    
            // Aplicar el ordenamiento si se especifica
            if (sort && sort.price) {
                queryBuilder = queryBuilder.sort(sort);  // Ordenamiento por precio
            }
    
            // Ejecutar la consulta y devolver los resultados
            return await queryBuilder;
        } catch (error) {
            // Manejo de errores
            console.error("Error al obtener los productos:", error.message);
            throw error;
        }
    }
    
    

    

    //GetProductById   --LISTO NUEVO
    async getProductById(id) {
        
        try {
            // Busca el producto directamente en la base de datos
            const product = await productModel.findById(id).lean();
    
            if (!product) {
                return null; // Si no se encuentra, devuelve null
            }
    
            return product; // Devuelve el producto encontrado
        } catch (error) {
            // Manejo de errores
            console.error("Error al obtener el producto:", error.message);
            throw error;
        }
        
    }

    //addProduct (para crear un producto)  ---LISTO NUEVO
    async addProduct(product) {
        const newProduct = {
            
            ...product,
            status: true
        }
        try {
            await productModel.create(newProduct);
            console.log("Producto creado:", newProduct);
        } catch (error) {
            console.log("Error al crear el producto:",error);
        }
        

        return newProduct;
    }

    //updateProduct --LISTO NUEVO
    async updateProduct(id, updatedFields){
        try {
            const updatedProduct = await productModel.updateOne({_id: id}, {$set: updatedFields});
                console.log("Producto actualizado:", updatedProduct);
                return updatedProduct;
        } catch (error) {
            console.log("Error al actualizar el producto:",error);
        }
        
        
    }
    //deleteProduct  -----LISTO NUEVO----
    async deleteProduct(id) {
        try {
            const deletedProduct = await productModel.deleteOne({_id: id});
                console.log("Producto eliminado:", deletedProduct);
                return deletedProduct;
        } catch (error) {
            console.log("Error al eliminar el producto:",error);
        }

        
    }
 
//NUEVA FUNCION

async getProductCount(filter) {
    try {
        // Contamos los productos que cumplen con el filtro
        const count = await productModel.countDocuments(filter);
        return count;
    } catch (error) {
        console.error("Error al contar los productos:", error.message);
        throw error;
    }
}


}