import hotelSchema from "../models/hotel.js";
import {getDbConnection} from "../config/db.js";

export async function createHotel(req, res) {
    const {name, location, rating, price, description, picture, amenities} = req.body;
    const {error} = hotelSchema.validate(req.body);
    if (error) {
        console.log(error);
        return res.status(400).json({error: error.details[0].message});
    }
    try {
        const pool = await getDbConnection();

        // Vérifier que les amenities sont un tableau et les convertir en une chaîne de texte
        const amenitiesString = Array.isArray(amenities) ? amenities.join(",") : "";

        const [result] = await pool.query(
            "INSERT INTO hotels (name, location, rating, price, description, picture, amenities) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [name, location, rating, price, description, picture, amenitiesString]
        );

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


export async function search(req, res) {
    let {id, term, destination, checkIn, checkOut, rating, price, amenities, limit = 10} = req.query;
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
        if (destination) {
            query += " AND location LIKE ?";
            params.push(`%${destination}%`);
        }
        if (rating) {
            query += " AND rating LIKE ?";
            params.push(`%${rating}%`);
        }
        if (price) {
            query += " AND price <= ?";
            params.push(price);
        }
        if (amenities) {
            // Convertir les amenities en tableau
            const amenitiesArray = Array.isArray(amenities) ? amenities : JSON.parse(amenities);

            if (amenitiesArray.length > 0) {
                // Vérifier que TOUTES les amenities demandées sont dans la colonne
                query += " AND " + amenitiesArray.map(() => "FIND_IN_SET(?, amenities)").join(" AND ");
                params.push(...amenitiesArray);
            }
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

export async function updateHotel(req, res) {
    const {id} = req.params;
    const {name, location, rating, price, description, picture, amenities, priceRange} = req.body;
    const pool = await getDbConnection();
    try {
        const updates = [];
        const values = [];

        if (name !== undefined) {
            updates.push("name = ?");
            values.push(name);
        }
        if (location !== undefined) {
            updates.push("location = ?");
            values.push(location);
        }
        if (rating !== undefined) {
            updates.push("rating = ?");
            values.push(rating);
        }
        if (price !== undefined) {
            updates.push("price = ?");
            values.push(price);
        }
        if (priceRange) {
            if (priceRange.min !== undefined) {
                updates.push("price >= ?");
                values.push(priceRange.min);
            }
            if (priceRange.max !== undefined) {
                updates.push("price <= ?");
                values.push(priceRange.max);
            }
        }
        if (description !== undefined) {
            updates.push("description = ?");
            values.push(description);
        }
        if (picture !== undefined) {
            updates.push("picture = ?");
            values.push(picture);
        }
        if (amenities !== undefined) {
            updates.push("amenities = ?");
            values.push(amenities.join(","));
        }

        values.push(id);

        const query = `UPDATE hotels
                       SET ${updates.join(", ")}
                       WHERE id = ?`;
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({error: "Hotel not found."});
        }
        res.status(200).json({message: "Hotel updated successfully."});
        pool.close();
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({error: err});
    }
}


export async function deleteHotel(req, res) {
    const {id} = req.params;
    const pool = await getDbConnection();
    try {
        const [result] = await pool.query("DELETE FROM hotels WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({error: "Hotel not found."});
        }
        res.status(200).json({message: "Hotel deleted successfully."});
        pool.close();
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({error: err});
    }
}
