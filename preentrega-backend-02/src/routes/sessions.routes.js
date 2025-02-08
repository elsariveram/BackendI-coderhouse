import { Router } from "express"

import passport from "passport";

import {  getUsers, createUser, updateUser, deleteUser, login } from "../services/sessions.controllers.js";

const sessionRouter = Router();

// sessionRouter.get('/:uid', getUser) //lo quite
sessionRouter.get('/', getUsers) 
sessionRouter.post('/register', passport.authenticate("register"),createUser) // quite passport.authenticate("register")
sessionRouter.put('/:uid', updateUser)
sessionRouter.delete('/:uid', deleteUser)
// sessionRouter.post("/login", passport.authenticate("login"), login);
sessionRouter.post("/login", (req, res, next) => {
    passport.authenticate("login", (err, user, info) => {
        if (err) return next(err);

        if (!user) {
            console.log("❌ Error en login:", info?.message || "Usuario o contraseña incorrectos");
            return res.status(401).json({ error: info?.message || "Usuario o contraseña incorrectos" });
        }

        req.logIn(user, (err) => {
            if (err) return next(err);
            login(req, res); // Llamar a tu función login si el usuario es válido
        });
    })(req, res, next);
});

sessionRouter.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => res.send(req.user)); 

export default sessionRouter;