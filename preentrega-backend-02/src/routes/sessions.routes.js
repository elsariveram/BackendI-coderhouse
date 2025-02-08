import { Router } from "express"

import passport from "passport";

import {  getUsers, createUser, updateUser, deleteUser, login } from "../services/sessions.controllers.js";

const sessionRouter = Router();

// sessionRouter.get('/:uid', getUser) //lo quite
sessionRouter.get('/', getUsers) 
sessionRouter.post('/register', passport.authenticate("register"),createUser) // quite passport.authenticate("register")
sessionRouter.put('/:uid', updateUser)
sessionRouter.delete('/:uid', deleteUser)
sessionRouter.post("/login", passport.authenticate("login"), login);
sessionRouter.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => res.send(req.user)); 

export default sessionRouter;