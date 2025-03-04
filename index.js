import express from "express";
import {getDbConnection} from "./config/db.js";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import hotelRouter from "./routes/hotelRouter.js";
import reservationRouter from "./routes/reservationRouter.js";
import cors from "cors";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("Bienvenue sur l'API de AccordsHotels !");
});
app.use("/api/users", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/reservations", reservationRouter);

async function initApp() {
    await getDbConnection();
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur le port ${PORT}`);
    });
}

initApp();
export {app};
