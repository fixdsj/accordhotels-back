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