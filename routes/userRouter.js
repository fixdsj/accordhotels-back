import express from "express";
import {createUser, deleteUser, login, search, updateUser} from "../controllers/userController.js";
import {authentication} from "../middlewares/authentication.js";

const userRouter = express.Router();

userRouter.post("/register", createUser)

userRouter.post("/login", login);

userRouter.get("/search", authentication, search);

userRouter.put("/:id", authentication, updateUser);

userRouter.delete("/:id", authentication, deleteUser);

export default userRouter;