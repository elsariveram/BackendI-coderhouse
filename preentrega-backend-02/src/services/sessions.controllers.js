import e from "express";
import { userModel } from "../models/userModel.js";
import mongoose from "mongoose";
import { create } from "domain";
import { createHash } from "../utils.js";
import express from 'express'

import bcrypt from 'bcrypt';
import {generateToken} from "../utils.js";
import { url } from "inspector";
import { title } from "process";

//login
export const login = async (req, res) => {
    
    try {
        if (!req.user){
            console.log("usuario o contraseña incorrectos");
            return res.status(401).send('usuario o contraseña incorrectos');
            
        }

      const token=  generateToken(req.user)

        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name,
            
        }

        console.log("El token es",token)

        //previo a redireccionar envio la cookie
        res.cookie('coderCookie', token, {httpOnly: true, secure: false, maxAge: 360000});// Guardar en cookie
        res.status(200).json({ 
            message: "Usuario logueado correctamente", 
            token,
            redirectTo: "/products"  // 🔹 Añadimos la ruta de redirección
        });

        console.log("Usuario logueado correctamente");
        
        // res.status(200).send('Usuario logueado correctamente'); //redirect('/')   -----revisar esta parte
    } catch (error) {
        console.log(error);
        console.log ("Error al loguear usuario");
            res.status(500).send({message: "Error al loguear usuario"});
    }
    
};

//getUser
//LO QUITÉ 
// export const getUser = async (req, res) => {
//     try {
//         const userId = req.params.uid;
//         const user = await userModel.findById(userId);
//         if (!user) {
//             return res.status(404).json({ error: "Usuario no encontrado" });
//         }
//         res.status(200).send(user);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: "Error al obtener el usuario" });
//     }
    
// }

//getUsers
export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).send(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al obtener los usuarios" });   
    }
}

//createUser (register)
export const createUser = async (req, res) => {
    try {
        if (!req.user){
            return res.status(400).send('El usuario ya existe');
        }
//token de usuario registrado
        const token=  generateToken(req.user)

        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name,
            
        }

        console.log("El token es",token)

        //previo a redireccionar envio la cookie
        res.cookie('coderCookie', token, {httpOnly: true, secure: false, maxAge: 360000});// Guardar en cookie
        res.status(200).json({ 
            message: "Usuario registrado correctamente", 
            token,
            redirectTo: "/products"  // ruta de redirección
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({message:'Error al registrar el usuario'});

    }

    
}

//actualizar usuario dado su ID
export const updateUser = async (req, res) => {
    try {
      const userId = req.params.uid;
      const { first_name, last_name, email, age } = req.body;
  
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { first_name, last_name, email, age },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
  
      res.status(200).json({ message: "Usuario actualizado", user: updatedUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  };
  
// export const updateUser = async (req, res) => {

//     try {
//     const userId = req.params.uid;
//     const { name, email, age } = req.body;
//     const message = await userModel.findByIdAndUpdate(idUser, { name, email, age } );
//     if (!message) {
//         return res.status(404).json({ error: "Usuario no encontrado" });
//     }
//     res.status(200).send("usuario actualizado", message);
// } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Error al actualizar el usuario" });
// }
// }

//Eliminar usuario dado su ID
export const deleteUser = async (req, res) => {
    
    try {
        const userId = req.params.uid;
        const deletedUser = await userModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.status(200).json({ message: "usuario eliminado", deletedUser});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al eliminar el usuario" });
    }
}

// views:

export const viewRegister = (req,res) => {
    res.status(200).render('register_user', {
        title: 'Registro - BikeMarket',
        url_js: '/js/register_user.js',
        url_css: '/css/register_user.css'
    })
}

export const viewLogin = (req,res) => {
    res.status(200).render('login', {
        title: 'Inicio de Sesion - BikeMarket',
        url_js: '/js/login.js',
        url_css: '/css/login.css'

    })
}

