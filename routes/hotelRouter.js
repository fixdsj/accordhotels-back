import express from "express";
import { createHotel, deleteHotel, search, updateHotel } from "../controllers/hotelController.js";
import { authentication } from "../middlewares/authentication.js";

const hotelRouter = express.Router();

/**
 * @swagger
 * /hotels/create:
 *   post:
 *     summary: Créer un nouvel hôtel
 *     description: Crée un hôtel avec les informations fournies
 *     tags:
 *       - Hôtels
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               rating:
 *                 type: number
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               picture:
 *                 type: string
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               capacity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Hôtel créé avec succès
 *       400:
 *         description: Erreur de validation
 *       500:
 *         description: Erreur serveur
 */
hotelRouter.post("/create", (req, res, next) => authentication(req, res, next, 'employee'), createHotel);

/**
 * @swagger
 * /hotels/search:
 *   get:
 *     summary: Rechercher des hôtels
 *     description: Recherche des hôtels selon les critères fournis
 *     tags:
 *       - Hôtels
 *     parameters:
 *       - name: id
 *         in: query
 *         schema:
 *           type: integer
 *       - name: term
 *         in: query
 *         schema:
 *           type: string
 *       - name: destination
 *         in: query
 *         schema:
 *           type: string
 *       - name: rating
 *         in: query
 *         schema:
 *           type: number
 *       - name: price
 *         in: query
 *         schema:
 *           type: number
 *       - name: amenities
 *         in: query
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Résultats de la recherche
 *       500:
 *         description: Erreur serveur
 */
hotelRouter.get("/search", search);

/**
 * @swagger
 * /hotels/{id}:
 *   put:
 *     summary: Mettre à jour un hôtel
 *     description: Modifie les informations d'un hôtel existant
 *     tags:
 *       - Hôtels
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
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               rating:
 *                 type: number
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               picture:
 *                 type: string
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Hôtel mis à jour avec succès
 *       404:
 *         description: Hôtel non trouvé
 *       500:
 *         description: Erreur serveur
 */
hotelRouter.put("/:id",  (req, res, next) => authentication(req, res, next, 'employee'), updateHotel);

/**
 * @swagger
 * /hotels/{id}:
 *   delete:
 *     summary: Supprimer un hôtel
 *     description: Supprime un hôtel par son ID
 *     tags:
 *       - Hôtels
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
 *         description: Hôtel supprimé avec succès
 *       404:
 *         description: Hôtel non trouvé
 *       500:
 *         description: Erreur serveur
 */
hotelRouter.delete("/:id",  (req, res, next) => authentication(req, res, next, 'employee'), deleteHotel);

export default hotelRouter;
