import jwt from 'jsonwebtoken';
import {getDbConnection} from '../config/db.js';

export async function authentication(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: "Le jeton est manquant.",
        });
    }

    try {
        // Récupérer les secrets depuis le fichier .env
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            return res.status(401).json({
                error: "JwtSecret inaccessible.",
            });
        }

        // Vérification du jeton avec la clé secrète récupérée
        const decoded = jwt.verify(token, jwtSecret);

        if (!decoded || typeof decoded !== "object") {
            return res.status(401).json({
                error: "Le jeton n'est pas valide.",
            });
        }

        const userId = decoded.userId;

        // Vérification de l'existence de l'utilisateur dans la base de données
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
        res.locals.user = user;
        return next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: "Le jeton a expiré. Veuillez vous reconnecter.",
                redirect: "/login"
            });
        }
        console.error("Erreur de vérification du jeton:", error);
        return res.status(500).json({error: "Erreur interne du serveur."});
    }
}
