import express from "express";
import {
    createReservation,
    deleteReservation,
    getReservations,
    updateReservation
} from "../controllers/reservationController.js";
import { authentication } from "../middlewares/authentication.js";

const reservationRouter = express.Router();

/**
 * @swagger
 * /reservations/create:
 *   post:
 *     summary: Créer une nouvelle réservation
 *     description: Crée une réservation pour un hôtel
 *     tags:
 *       - Réservations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               hotel_id:
 *                 type: integer
 *               check_in_date:
 *                 type: string
 *                 format: date
 *               check_out_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [unconfirmed, confirmed, cancelled]
 *               total_price:
 *                 type: number
 *               people:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 *       500:
 *         description: Erreur serveur
 */
reservationRouter.post("/create", authentication, createReservation);

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Récupérer les réservations d'un utilisateur
 *     description: Retourne les réservations liées à un utilisateur spécifique
 *     tags:
 *       - Réservations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des réservations
 *       500:
 *         description: Erreur serveur
 */
reservationRouter.get("/:id", authentication, getReservations);

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Mettre à jour une réservation
 *     description: Modifier les informations d'une réservation existante
 *     tags:
 *       - Réservations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               check_in_date:
 *                 type: string
 *                 format: date
 *               check_out_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [unconfirmed, confirmed, cancelled]
 *     responses:
 *       200:
 *         description: Réservation mise à jour avec succès
 *       404:
 *         description: Réservation non trouvée
 *       500:
 *         description: Erreur serveur
 */
reservationRouter.put("/:id", authentication, updateReservation);

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Supprimer une réservation
 *     description: Supprime une réservation par son ID
 *     tags:
 *       - Réservations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Réservation supprimée avec succès
 *       404:
 *         description: Réservation non trouvée
 *       500:
 *         description: Erreur serveur
 */
reservationRouter.delete("/:id", authentication, deleteReservation);

export default reservationRouter;
