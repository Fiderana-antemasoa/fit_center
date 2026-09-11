import { Request, Response } from 'express';
import { abonnementService } from '../services/abonnement.service';

export const getAbonnements = async (req: Request, res: Response) => {
  try {
    const abonnements = await abonnementService.getAll();
    res.status(200).json(abonnements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getAbonnement = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const abonnement = await abonnementService.getById(id);

    if (!abonnement) {
      res.status(404).json({
        message: 'Abonnement introuvable'
      });
      return;
    }

    res.status(200).json(abonnement);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur serveur'
    });
  }
};

export const createAbonnement = async (req: Request, res: Response) => {
  try {
    const abonnement = await abonnementService.create(req.body);

    res.status(201).json(abonnement);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur lors de la création de l'abonnement"
    });
  }
};

export const updateAbonnement = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const abonnement = await abonnementService.update(
      id,
      req.body
    );

    res.status(200).json(abonnement);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur lors de la modification de l'abonnement"
    });
  }
};

export const deleteAbonnement = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    await abonnementService.delete(id);

    res.status(204).send();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur lors de la suppression de l'abonnement"
    });
  }
};