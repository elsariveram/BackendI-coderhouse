import { Router } from "express"

import passport from "passport";

import { getUser, getUsers, createUser, updateUser, deleteUser, login } from "../services/sessions.controllers.js";



const sessionRouter = Router();



sessionRouter.get('/', getUsers)
sessionRouter.get('/:uid', getUser)
sessionRouter.post('/register', passport.authenticate("register"),createUser)
sessionRouter.put('/:uid', updateUser)
sessionRouter.delete('/:uid', deleteUser)
// sessionRouter.post("/login", login);
sessionRouter.post("/login", passport.authenticate("login"), login);





export default sessionRouter;