import express from "express";
import {createHotel, deleteHotel, search, updateHotel} from "../controllers/hotelController.js";
import {authentication} from "../middlewares/authentication.js";

const hotelRouter = express.Router();

hotelRouter.post("/create", authentication, createHotel);
hotelRouter.get("/search", search);
hotelRouter.put("/:id", authentication, updateHotel);
hotelRouter.delete("/:id", authentication, deleteHotel);

export default hotelRouter;
