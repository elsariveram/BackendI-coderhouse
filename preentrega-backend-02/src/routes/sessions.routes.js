import { Router } from "express"

import passport from "passport";

import { getUser, getUsers, createUser, updateUser, deleteUser, login } from "../services/sessions.controllers.js";



const sessionRouter = Router();



sessionRouter.get('/', getUsers)
sessionRouter.get('/:uid', getUser)
sessionRouter.post('/register', passport.authenticate("register"),createUser) // passport.authenticate("register")
sessionRouter.put('/:uid', updateUser)
sessionRouter.delete('/:uid', deleteUser)
// sessionRouter.post("/login", login);
sessionRouter.post("/login", passport.authenticate("login"), login);
// sessionRouter.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => res.send(req.user)); 
// sessionRouter.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
//     console.log("Usuario autenticado:", req.user);
//     if (!req.user) {
//         return res.status(401).json({ error: "No autorizado" });
//     }
//     res.send(req.user);
// });
sessionRouter.get('/current', (req, res) => {
    console.log("🔹 Se accedió a la ruta /current");
    res.send({ message: "Ruta accesible sin Passport" });
});






export default sessionRouter;