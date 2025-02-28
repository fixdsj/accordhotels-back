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
    const {name, location, rating, price, description, picture, amenities, limit} = req.query;
    // Gerer le cas ou tous les parametres sont vides ou certains sont vides

    //Gerer la limite
    if (!limit) {
        const limit = 10;
    }
    try {
        const pool = await getDbConnection();
        const [result] = await pool.query("SELECT * FROM hotels WHERE name = ? AND location = ? AND rating = ? AND price = ? AND description = ? AND picture = ? AND amenities = ? LIMIT = ? [name, location, rating, price, description, picture, JSON.stringify(amenities), limit]");
        res.status(200).json(result);
        pool.close();
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({error: err});
    }
}