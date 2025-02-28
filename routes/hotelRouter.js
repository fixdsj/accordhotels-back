import express from "express";
import {createHotel} from "../controllers/hotelController.js";
import {authentication} from "../middlewares/authentication.js";

const hotelRouter = express.Router();

hotelRouter.post("/create", authentication, createHotel);

export default hotelRouter;
