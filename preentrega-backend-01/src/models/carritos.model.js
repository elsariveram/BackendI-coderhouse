import mongoose from "mongoose";
import { type } from "os";

const cartsCollection = "carritos";

const cartSchema = new mongoose.Schema({ 
    
    products: [{
        _id: false,
        id:{ type: mongoose.Schema.Types.ObjectId, ref: 'productos', required: true },
        // // { type: String, required: true },
        quantity: {
            type: Number,
            required: true,  // La cantidad debe estar definida
            min: [1, 'La cantidad debe ser al menos 1']  // Puede agregar restricciones como un mínimo de cantidad
        }
    }]
});


export const cartModel = mongoose.model(cartsCollection, cartSchema);
