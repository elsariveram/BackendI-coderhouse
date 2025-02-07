import mongoose from "mongoose";

import { cartModel } from "../models/carritos.model.js";

////falta algo aca

const userSchema = new mongoose.Schema({ 
    
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
    },
    email: {
        type:String , 
        unique: true, 
        required: true
    },
    age: {
        type:Number, required: true
    }, 
    password: {
        type:String
    }, //(Hash)
    cart:{
         type: mongoose.Schema.Types.ObjectId,
          ref: 'carritos', 
          required: true
         }, //con referencia a Carts,
    role:{
        type:String,
         default: 'user'
        } 
    
});

//Agrega un nuevo carrito al crear un usuario
userSchema.post('save', async function name(userCreated) {
    try {
        const newCart = await cartModel.create({ products: [] });
        userCreated.cart = newCart._id;//referencio el id del carrito con el usuario.
        await userCreated.save();
    }
    catch (error) {
        console.log("error al crear el carrito del usuario", error);
    }
    this.populate('cart');
});

export const userModel = mongoose.model('users', userSchema);
