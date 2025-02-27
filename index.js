import express from "express";
import { getDbConnection } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Bienvenue sur l'API de AccordsHotels !");
});

async function initApp() {
    await getDbConnection();
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur le port ${PORT}`);
    });
}

initApp();
