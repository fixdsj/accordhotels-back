import express from "express";
import {getDbConnection} from "./config/db.js";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import hotelRouter from "./routes/hotelRouter.js";
import reservationRouter from "./routes/reservationRouter.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;



// Configuration Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "accordsHotels API",
            version: "1.0.0",
            description: "Documentation de l’API backend pour AccordsHotels",
        },
        servers: [
            {
                url: `http://localhost:${PORT}/api`,
                description: "Serveur local",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                }
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./routes/*.js"], // Chemin vers les fichiers contenant les endpoints
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
// Documentation Swagger sur /api/docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("Bienvenue sur l'API de AccordsHotels!");
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
