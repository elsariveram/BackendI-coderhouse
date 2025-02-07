import passport, { Passport } from "passport";
import  local  from "passport-local";
import { userModel } from '../models/userModel.js';

import { createHash, isValidPassword } from "../utils.js";
import e from "express";

import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';



//creacion del local strategy

// localStrategy = local.Strategy

const initializePassport = () => {
    passport.use('register', new LocalStrategy ({passReqToCallback: true, usernameField: 'email'}, async (req, username, password, done) => {
           try {
                const { first_name, last_name, email, age, password, cart, role } = req.body;
                const findUser = await userModel.findOne({ email : email });
                if (!findUser) {
                    const newUser = await userModel.create({ first_name, last_name, email, age, password:createHash(password), cart, role });
                   
                    return done(null, newUser);
                   
                } else {
                    return done(null, false);
                }
                
               
            } catch (error) {
                console.log(error);
                return done(error);
                // res.status(500).json({ error: "Error al crear el usuario" });
            }
        }
    ))

    //LOGIN
            // Función para verificar la contraseña
        const isValidPassword = (inputPassword, hashedPassword) => {
            return bcrypt.compareSync(inputPassword, hashedPassword);
        };

        // Estrategia de login con Passport
        passport.use('login', new LocalStrategy(
            { usernameField: 'email' }, 
            async (email, password, done) => {
                try {
                    // Buscar usuario en la base de datos
                    const user = await userModel.findOne({ email });

                    if (!user) {
                        return done(null, false, { message: "Usuario no encontrado" });
                    }

                    // Verificar la contraseña
                    if (!isValidPassword(password, user.password)) {
                        return done(null, false, { message: "Contraseña incorrecta" });
                    }

                    // Si todo está bien, pasar el usuario a la sesión
                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        ));

        // Serialización del usuario en la sesión
        passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        // Deserialización del usuario
        passport.deserializeUser(async (id, done) => {
            try {
                const user = await userModel.findById(id);
                done(null, user);
            } catch (error) {
                done(error);
            }
        });



    // passport.use('login', new localStrategy ({usernameField: 'email'}, async ( username, password, done) => {

    //     try {
    //                 // Función para verificar si la contraseña ingresada es válida
    //                 const isValidPassword = (inputPassword, hashedPassword) => {
    //                     return bcrypt.compareSync(inputPassword, hashedPassword);
    //                 };

    //         const user = await userModel.findOne({ email: username });

    //         if (user && isValidPassword(password, user.password)) {
    //             return done(null, user);
    //         } else {
    //             return done(null, false);
    //         }
    //         // if (user && isValidPassword(password, user.password)) {
    //         //     return done(null, user);

    //             // const isPasswordValid = await bcrypt.compare(password, user.password);
    //             // if (!isPasswordValid) {
    //             //     return res.status(400).send('Datos incorrectos');
    //             // }

    //             // } else {
    //             //     return done(null, false);
    //             // }
        
    //  } catch (error) {
    //     return done(error);
    //  }
    // }));
    //pasos necesarios para trabajar via http en passport
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    });
}

// export default initializePassport
export { initializePassport };