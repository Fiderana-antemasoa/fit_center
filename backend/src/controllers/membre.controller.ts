import { Request, Response } from 'express';
import { membreService } from '../services/membre.service';

export const getMembres = async (req: Request, res: Response) => {
  try {
    const membres = await membreService.getAll();
    res.status(200).json(membres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getMembre = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const membre = await membreService.getById(id);

    if (!membre) {
      res.status(404).json({ message: 'Membre introuvable' });
      return;
    }

    res.status(200).json(membre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createMembre = async (req: Request, res: Response) => {
  try {
    const membre = await membreService.create(req.body);
    res.status(201).json(membre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création' });
  }
};

export const updateMembre = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const membre = await membreService.update(id, req.body);
    res.status(200).json(membre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la modification' });
  }
};

export const deleteMembre = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await membreService.delete(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};