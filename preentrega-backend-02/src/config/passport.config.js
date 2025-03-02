// para .env (guardar contraseñas y datos no publicos)
import "dotenv/config";
//passport
import passport, { Passport } from "passport";
import  local  from "passport-local";
import { userModel } from '../models/userModel.js';

import { createHash , isValidPassword} from "../utils.js";
import e from "express";

// import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

import jwt from 'passport-jwt';
import { Cookie } from "express-session";


//creacion del local strategy

const localStrategy = local.Strategy
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

// cookieExtractor
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['coderCookie'];//nombre de la cookie
    }
    console.log("🔹👀 Token extraído:", token); // 👀 Verificar si el token se extrae correctamente
    return token
}

//Middleware para errores de passport
export const passportCall =  (strategy) => {
    return async(req,res,next) => {
        
        passport.authenticate(strategy, function(err,user, info) {
            if(err) return next(err)
            
            if(!user) {
                return res.status(401).send({error: info.messages?info.messages: info.toString()})
            }
            req.user = user
            next()
        } (req,res,next))
    }
}

//configuracion de passport
const initializePassport = () => {

    // Serialización del usuario en la sesión
    passport.serializeUser((user, done) => {
        done(null, user._id)
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

    //REGISTRO
    passport.use('register', new localStrategy ({passReqToCallback: true, usernameField: 'email'}, async (req, username, password, done) => {
           try {
                const { first_name, last_name, email, age, password, cart, role } = req.body;
                const findUser = await userModel.findOne({ email : email });
                if (!findUser) {
                    const newUser = await userModel.create({
                         first_name: first_name,
                          last_name: last_name,
                            email: email,
                            age: age,
                            password:createHash(password),
                            cart: cart,
                            role: role 
                        
                        });
                   
                    return done(null, newUser);
                   
                } else {
                    return done(null, false);
                }
                
               
            } catch (error) {
                console.log(error);
                return done(error);
                res.status(500).json({ error: "Error al crear el usuario" });
            }
        }
    ))

    //LOGIN
            // Función para verificar la contraseña
        // const isValidPassword = (inputPassword, hashedPassword) => {
        //     return bcrypt.compareSync(inputPassword, hashedPassword);
        // };



    // Estrategia de login con Passport
        passport.use('login', new localStrategy(
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


 //JWT  (AQUI PUEDE ESTAR EL ERROR)
        passport.use('jwt', new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: process.env.JWT_SECRET
        
        }, async (jwt_payload, done) => {
            
            try {

                console.log(jwt_payload);
                
                return done(null, jwt_payload.user);//nuevo agrego .user

    
            } catch (error) {
                return done(error);
            }
        }));

}


export { initializePassport };