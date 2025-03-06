import {getDbConnection} from "../config/db.js";

export async function createReservation(req, res) {
    const {user_id, hotel_id, check_in_date, check_out_date, status, total_price, people} = req.body;

    try {
        const pool = await getDbConnection();
        const [result] = await pool.query(
            "INSERT INTO reservations (user_id, hotel_id, check_in_date, check_out_date, status, total_price, people) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [user_id, hotel_id, new Date(check_in_date).toISOString().split("T")[0], new Date(check_out_date).toISOString().split("T")[0], status, total_price, people]
        );
        const reservationId = result.insertId;
        res.status(201).json({
            message: "Réservation créée avec succès.",
            reservation: {user_id, hotel_id, check_in_date, check_out_date, status, total_price, people},
            reservationId,
        });
        pool.close();
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({error: err});
    }
}


export async function getReservations(req, res) {
    const {id} = req.params;
    try {
        const pool = await getDbConnection();
        const [result] = await pool.query("SELECT * FROM reservations WHERE user_id = ?", [id]);
        res.status(200).json(result);
        pool.close();
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({error: err});
    }
}

export async function updateReservation(req, res) {
    const {id} = req.params;
    const {check_in_date, check_out_date, status} = req.body;

    //Construction de la requete

    const updateFields = [];
    const updateValues = [];
    if (check_in_date && check_out_date) {
        if (new Date(check_in_date) > new Date(check_out_date)) {
            return res.status(400).json({error: "La date d'arrivée ne peut pas être après la date de départ."});
        }
        updateFields.push("check_in_date = ?, check_out_date = ?");
        updateValues.push(new Date(check_in_date).toISOString().split("T")[0]);
        updateValues.push(new Date(check_out_date).toISOString().split("T")[0]);
    }
    if (status === "unconfirmed" || status === "confirmed" || status === "cancelled") {
        updateFields.push("status = ?");
        updateValues.push(status);
    }
    try {
        const pool = await getDbConnection();
        const [result] = await pool.query(
            `UPDATE reservations
             SET ${updateFields.join(", ")}
             WHERE id = ?`,
            [...updateValues, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({error: "Réservation non trouvée."});
        }
        res.status(200).json({
            message: "Réservation mise à jour avec succès.",
            reservation: {check_in_date, check_out_date, status},
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
        res.status(204).send('Réservation supprimée avec succès.');
        pool.close();
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({error: err});
    }
}

