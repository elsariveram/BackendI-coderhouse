import { Router } from "express"

import passport from "passport";

import {  getUsers, createUser, updateUser, deleteUser, login , viewLogin, viewRegister} from "../services/sessions.controllers.js";

import { authorization } from "../config/middlewares.js";

const sessionRouter = Router();

sessionRouter.get('/viewlogin', viewLogin)
sessionRouter.get('/viewregister', viewRegister)
// sessionRouter.get('/:uid', getUser) //lo quite
sessionRouter.get('/', getUsers) //ok
sessionRouter.post('/register', passport.authenticate("register"),createUser) // 
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


//ruta current--------------------
sessionRouter.get(
    "/current",
    // (req, res, next) => {
    //   console.log("Middleware antes de Passport");
    //   next();
    // },
    passport.authenticate("jwt", { session: false }), authorization("user"),
    async (req, res) => {  //async nuevo
      console.log("Usuario autenticado:", req.user);
      res.send(req.user);
    }
  );
  

export default sessionRouter;