import reservationSchema from "../models/reservation.js";
import {getDbConnection} from "../config/db.js";

export async function createReservation(req, res) {
    const {user, hotel, check_in_date, check_out_date, status} = req.body;
    const {error} = reservationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    try {
        const pool = await getDbConnection();
        const [result] = await pool.query(
            "INSERT INTO reservations (user, hotel, check_in_date, check_out_date, status) VALUES (?, ?, ?, ?, ?)",
            [user, hotel, check_in_date, check_out_date, status]
        );
        const reservationId = result.insertId;
        res.status(201).json({
            message: "Réservation créée avec succès.",
            reservation: {user, hotel, check_in_date, check_out_date, status},
            reservationId,
        });
        pool.close();
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({error: err});
    }
}

export async function getReservations(req, res) {
    try {
        const pool = await getDbConnection();
        const [result] = await pool.query("SELECT * FROM reservations");
        res.status(200).json(result);
        pool.close();
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({error: err});
    }
}

export async function updateReservation(req, res) {
    const {id} = req.params;
    const {user, hotel, check_in_date, check_out_date, status} = req.body;
    const {error} = reservationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    try {
        const pool = await getDbConnection();
        const [result] = await pool.query(
            "UPDATE reservations SET user = ?, hotel = ?, check_in_date = ?, check_out_date = ?, status = ? WHERE id = ?",
            [user, hotel, check_in_date, check_out_date, status, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({error: "Réservation non trouvée."});
        }
        res.status(200).json({
            message: "Réservation mise à jour avec succès.",
            reservation: {user, hotel, check_in_date, check_out_date, status},
        });
        pool.close();
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({error: err});
    }
}

export async function deleteReservation(req, res) {
    const {id} = req.params;
    try {
        const pool = await getDbConnection();
        const [result] = await pool.query("DELETE FROM reservations WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({error: "Réservation non trouvée."});
        }
        res.status(204).send();
        pool.close();
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({error: err});
    }
}

