import { Router } from 'express';
import {
  getMembres,
  getMembre,
  createMembre,
  updateMembre,
  deleteMembre
} from '../controllers/membre.controller';

const router = Router();

/**
 * @swagger
 * /api/membres:
 *   get:
 *     summary: Récupérer tous les membres
 *     tags:
 *       - Membres
 *     responses:
 *       200:
 *         description: Liste des membres
 */
router.get('/', getMembres);

/**
 * @swagger
 * /api/membres/{id}:
 *   get:
 *     summary: Récupérer un membre par son ID
 *     tags:
 *       - Membres
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Membre trouvé
 *       404:
 *         description: Membre introuvable
 */
router.get('/:id', getMembre);

/**
 * @swagger
 * /api/membres:
 *   post:
 *     summary: Créer un membre
 *     tags:
 *       - Membres
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - mail
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Rakoto Jean
 *               telephone:
 *                 type: string
 *                 example: "0341234567"
 *               mail:
 *                 type: string
 *                 example: jean@gmail.com
 *               dateInscription:
 *                 type: string
 *                 format: date
 *                 example: "2026-09-11"
 *               statutMembre:
 *                 type: string
 *                 example: ACTIF
 *     responses:
 *       201:
 *         description: Membre créé
 */
router.post('/', createMembre);

/**
 * @swagger
 * /api/membres/{id}:
 *   put:
 *     summary: Modifier un membre
 *     tags:
 *       - Membres
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
 *               nom:
 *                 type: string
 *               telephone:
 *                 type: string
 *               mail:
 *                 type: string
 *               dateInscription:
 *                 type: string
 *                 format: date
 *               statutMembre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Membre modifié
 *       404:
 *         description: Membre introuvable
 */
router.put('/:id', updateMembre);

/**
 * @swagger
 * /api/membres/{id}:
 *   delete:
 *     summary: Supprimer un membre
 *     tags:
 *       - Membres
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Membre supprimé
 *       404:
 *         description: Membre introuvable
 */
router.delete('/:id', deleteMembre);

export default router;