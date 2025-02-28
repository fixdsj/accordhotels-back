import express from "express";
import {createHotel, searchAll} from "../controllers/hotelController.js";
import {authentication} from "../middlewares/authentication.js";

const hotelRouter = express.Router();

hotelRouter.post("/create", authentication, createHotel);
hotelRouter.get("/search", searchAll);

export default hotelRouter;
