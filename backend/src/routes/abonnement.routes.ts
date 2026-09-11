import { Router } from 'express';
import {
  getAbonnements,
  getAbonnement,
  createAbonnement,
  updateAbonnement,
  deleteAbonnement
} from '../controllers/abonnement.controller';

const router = Router();

/**
 * @swagger
 * /api/abonnements:
 *   get:
 *     summary: Récupérer tous les abonnements
 *     tags:
 *       - Abonnements
 *     responses:
 *       200:
 *         description: Liste des abonnements
 */
router.get('/', getAbonnements);

/**
 * @swagger
 * /api/abonnements/{id}:
 *   get:
 *     summary: Récupérer un abonnement par son ID
 *     tags:
 *       - Abonnements
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Abonnement trouvé
 *       404:
 *         description: Abonnement introuvable
 */
router.get('/:id', getAbonnement);

/**
 * @swagger
 * /api/abonnements:
 *   post:
 *     summary: Créer un abonnement
 *     tags:
 *       - Abonnements
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - dateDebut
 *               - dateFin
 *               - prix
 *               - membreId
 *             properties:
 *               type:
 *                 type: string
 *                 example: MENSUEL
 *               dateDebut:
 *                 type: string
 *                 format: date
 *                 example: "2026-09-11"
 *               dateFin:
 *                 type: string
 *                 format: date
 *                 example: "2026-10-10"
 *               prix:
 *                 type: number
 *                 example: 50000
 *               statutAbonnement:
 *                 type: string
 *                 example: ACTIF
 *               membreId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Abonnement créé
 */
router.post('/', createAbonnement);

/**
 * @swagger
 * /api/abonnements/{id}:
 *   put:
 *     summary: Modifier un abonnement
 *     tags:
 *       - Abonnements
 *     parameters:
 *       - in: path
 *         name: id
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
 *               type:
 *                 type: string
 *               dateDebut:
 *                 type: string
 *                 format: date
 *               dateFin:
 *                 type: string
 *                 format: date
 *               prix:
 *                 type: number
 *               statutAbonnement:
 *                 type: string
 *               membreId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Abonnement modifié
 *       404:
 *         description: Abonnement introuvable
 */
router.put('/:id', updateAbonnement);

/**
 * @swagger
 * /api/abonnements/{id}:
 *   delete:
 *     summary: Supprimer un abonnement
 *     tags:
 *       - Abonnements
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Abonnement supprimé
 *       404:
 *         description: Abonnement introuvable
 */
router.delete('/:id', deleteAbonnement);

export default router;