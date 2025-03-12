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

        console.log("decoded.user.id:",  decoded);
        const userId = decoded.userId;
        const pool = await getDbConnection();
        if (!pool) {
            return res.status(500).json({error: "Erreur de connexion à la base de données."});
        }
        const result = await pool.query("SELECT id FROM users WHERE id = ?", [userId]);

        if (!result || result.length === 0) {
            return res.status(401).json({
                error: "Utilisateur non trouvé.",
            });
        }

        const user = result[0];
        console.log(result);
        console.log("user:", user);
        console.log("role required:", requiredRole);
        console.log("user role:", user.role);
        if (requiredRole === 'administrator' && user.role !== 'administrator') {
            console.log("le role requis est ", requiredRole, " et le role de l'utilisateur est ", user.role);
            return res.status(403).json({
                error: "Vous n'êtes pas autorisé à effectuer cette action.",
            });
        } else if (requiredRole === 'employee') {
            if (user.role !== 'employee' || user.role !== 'administrator') {
                console .log("le role requis est ", requiredRole, " et le role de l'utilisateur est ", user.role);
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
