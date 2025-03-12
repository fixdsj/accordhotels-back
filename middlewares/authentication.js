import jwt from 'jsonwebtoken';
import {getDbConnection} from '../config/db.js';

export async function authentication(req, res, next, requiredRole = 'normal') {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: "Le jeton est manquant.",
        });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            return res.status(401).json({
                error: "JwtSecret inaccessible.",
            });
        }

        const decoded = jwt.verify(token, jwtSecret);


        if (!decoded || typeof decoded !== "object") {
            return res.status(401).json({
                error: "Le jeton n'est pas valide.",
            });
        }


        const userId = decoded.userId;
        const pool = await getDbConnection();

        const result = await pool.query("SELECT id FROM users WHERE id = ?", [userId]);

        if (!result || result.length === 0) {
            return res.status(401).json({
                error: "Utilisateur non trouvé.",
            });
        }
        const currentRole = decoded.role;
        const user = result[0];

        if (requiredRole === 'administrator' && currentRole !== 'administrator') {
            return res.status(403).json({
                error: "Vous n'êtes pas autorisé à effectuer cette action.",
            });
        } else if (requiredRole === 'employee') {
            if (currentRole !== 'employee' && currentRole !== 'administrator') {
                return res.status(403).json({
                    error: "Vous n'êtes pas autorisé à effectuer cette action.",
                });
            }
        }
        res.locals.user = user;
        return next();

    } catch (error) {
        console.error("Erreur de vérification du jeton:", error);
        return res.status(500).json({error: "Erreur interne du serveur."});
    }
}
