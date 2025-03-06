import express from "express";
import {
    createReservation,
    deleteReservation,
    getReservations,
    updateReservation
} from "../controllers/reservationController.js";
import {authentication} from "../middlewares/authentication.js";

const reservationRouter = express.Router();

reservationRouter.post("/create", authentication, createReservation);
reservationRouter.get("/:id", authentication, getReservations);
reservationRouter.put("/:id", authentication, updateReservation);
reservationRouter.delete("/:id", authentication, deleteReservation);

export default reservationRouter;
