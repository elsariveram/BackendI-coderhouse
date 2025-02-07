import e from "express";
import { userModel } from "../models/userModel.js";
import mongoose from "mongoose";
import { create } from "domain";
import { createHash } from "../utils.js";
import express from 'express'

import bcrypt from 'bcrypt';

export const login = async (req, res) => {
    
    try {
        if (!req.user){
            return res.status(401).send('usuario o contraseña incorrectos');
        }
        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name,
        }
        res.status(200).send('Usuario logueado correctamente');
    } catch (error) {
        console.log(error);
            res.status(500).send("Error al loguear usuario");
    }
    // if (!user) {
    //     return res.status(404).send('Usuario no encontrado');
    // }

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //     return res.status(400).send('Datos incorrectos');
    // }

    // req.session.email = user.email;
    // req.session.rol = user.role;
    // req.session.first_name = user.first_name;
    // req.session.last_name = user.last_name;

    // res.status(200).send('Usuario logueado');
};



export const getUser = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al obtener el usuario" });
    }
    
}
export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).send(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al obtener los usuarios" });   
    }
}

export const createUser = async (req, res) => {
    try {
        if (!req.user){
            return res.status(400).send('El usuario ya existe');
        }
        res.status(200).send('Usuario registrado correctamente');
        // const { first_name, last_name, email, age, password, cart, role } = req.body;
        // const newUser = await userModel.create({ first_name, last_name, email, age, password:createHash(password), cart, role });
        // res.status(201).send("usuario registrado correctamente");
        // res.status(201).redirect('/login');
    } catch (error) {
        console.log(error);
        // res.status(500).json({ error: "Error al crear el usuario" });
        res.status(500).send('Error al crear el usuario');

    }
}

export const updateUser = async (req, res) => {

    try {
    const userId = req.params.uid;
    const { name, email, age } = req.body;
    const message = await userModel.findByIdAndUpdate(idUser, { name, email, age } );
    if (!message) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).send("usuario actualizado", message);
} catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
}
}

//Eliminar usuario dado su ID
export const deleteUser = async (req, res) => {
    
    try {
        const userId = req.params.uid;
        const deletedUser = await userModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.status(200).send("usuario eliminado", deletedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al eliminar el usuario" });
    }
}



