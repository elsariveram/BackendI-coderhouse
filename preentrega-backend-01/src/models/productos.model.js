import mongoose from "mongoose";

const productsCollection = "productos";

const productSchema = new mongoose.Schema({ 
    
    id: { type: String }, //AÑADIDO PARA VALIDAR CARRITO EN CARTSMANAGER
    title: String,
    name: { type: String, required: true },
    description: String,
    code: String,
    price: { type: Number, required: true },
    stock: Number,
    category: String,
    thumbnails: [String],
    status: Boolean
});

export const productModel = mongoose.model(productsCollection, productSchema);
