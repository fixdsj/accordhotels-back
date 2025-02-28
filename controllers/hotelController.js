import hotelSchema from "../models/hotel.js";
import {getDbConnection} from "../config/db.js";

export async function createHotel(req, res) {
    const {name, location, rating, price, description, picture, amenities} = req.body;
    const {error} = hotelSchema.validate(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    try {
        const pool = await getDbConnection();
        const [result] = await pool.query("INSERT INTO hotels (name, location, rating, price, description, picture, amenities) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [name, location, rating, price, description, picture, JSON.stringify(amenities)]);
        const hotelId = result.insertId;
        res.status(201).json({
            message: "Hotel created successfully.",
            hotelId,
        });
        pool.close();
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({error: err});
    }
}

export async function searchAll(req, res) {
    let {id, term, location, checkIn, checkOut, rating, price, amenities, limit = 10} = req.query;
    try {
        const pool = await getDbConnection();
        // Initialisation de la requête SQL avec "WHERE 1=1"
        // Cela permet d'ajouter des conditions "AND"  sans se soucier de la première condition.
        // Avec "WHERE 1=1", nous pouvons toujours ajouter des conditions "AND" sans vérifier si c'est la première condition.
        // Simplification de la construction dynamique de la requête
        let query = "SELECT * FROM hotels WHERE 1=1";
        const params = [];

        if (id) {
            query += " AND id = ?";
            params.push(id);
        }
        if (term) {
            query += " AND name LIKE ?";
            params.push(`%${term}%`);
        }
        if (location) {
            query += " AND location LIKE ?";
            params.push(`%${location}%`);
        }
        if (rating) {
            query += " AND rating LIKE ?";
            params.push(`%${rating}%`);
        }
        if (price) {
            query += " AND price <= ?";
            params.push(price);
        }
        if (term) {
            query += " AND description LIKE ?";
            params.push(`%${term}%`);
        }
        if (amenities) {
            query += " AND amenities LIKE ?";
            params.push(`%${JSON.stringify(amenities)}%`);
        }

        if (checkIn && checkOut) {
            query += " AND id NOT IN (SELECT hotel_id FROM reservations WHERE check_in < ? AND check_out > ?)";
            params.push(checkOut, checkIn);
        }

        //Ne pas rajouter de limit si un ID est spécifié
        if (limit && parseInt(limit) > 0 && parseInt(limit) < 100 && !id) {
            query += " LIMIT ?";
            params.push(parseInt(limit));
        }

        const [result] = await pool.query(query, params);
        res.status(200).json(result);
        pool.close();
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({error: err});
    }
}
