import express, { Router } from "express";
import { getUser, getUsers, createUser, updateUser, deleteUser } from "../services/sessions.controllers.js";

const userRouter = Router();

userRouter.get('/', getUsers)
userRouter.get('/:uid', getUser)
userRouter.post('/', createUser)
userRouter.put('/:uid', updateUser)
userRouter.delete('/:uid', deleteUser)


export default userRouter