import express from "express";
import {createUser, login, readAll} from "../controllers/userController.js";
import {authentication} from "../middlewares/authentication.js";

const userRouter = express.Router();

userRouter.post("/register", createUser)

userRouter.post("/login", login);

userRouter.get("/:email", authentication, readAll);

export default userRouter;