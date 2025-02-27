import express from "express";
import {createUser, login, readAll} from "../controllers/userController.js";
import {authentication} from "../middlewares/authentication.js";

const userRouter = express.Router();

userRouter.post("/users/create", createUser)

userRouter.post("/users/login", login);

userRouter.get("/users/:email", authentication, readAll);

export default userRouter;