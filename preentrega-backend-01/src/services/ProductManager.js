import fs from 'fs/promises';
import path from 'path';

const productosFilePath = path.resolve( 'data', 'productos.json');

export default class ProductManager {
    //constructor
        constructor() {
            this.products = [];
            this.init();
        }

            async init() {
                try {
                    const data = await fs.readFile(productosFilePath, 'utf-8');
                    this.products = JSON.parse(data);
                } catch (error) {
                this.products = [];
                }
            }
    //**METODOS**

    //saveToFile
    async saveToFile() {
        const jasonData = JSON.stringify(this.products, null, 2);
        await  fs.writeFile(productosFilePath, jasonData);
    }


    //getAllProducts
       async getAllProducts(limit) {
                if (limit) {
                    return this.products.slice(0, limit);
                }
                return this.products;
            }


    //GetProductById
    async getProductById(id) {
        const producto = this.products.find(product => product.id === id);

        if (!producto) {
            return null;
        }

         return producto;
    }

    //addProduct
    async addProduct(product) {
        const newProduct = {
            id: this.products.length ? this.products[this.products.length - 1].id + 1 : 1,
            ...product,
            status: true
        }
        this.products.push(newProduct);
        //guardar en el archivo
        this.saveToFile();

        return newProduct;
    }

    //updateProduct
    async updateProduct(id, updatedFields){
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) return null;

        const updatedProduct ={
            ...this.products[productIndex],
            ...updatedFields,
            id: this.products[productIndex].id, 
        };
        this.products[productIndex] = updatedProduct;
        this.saveToFile();
        return updatedProduct;
    }
    //deleteProduct
    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) return null;

        const deletedProduct = this.products.splice(productIndex, 1);

        this.saveToFile();

        return deletedProduct[0];
    }
 

}