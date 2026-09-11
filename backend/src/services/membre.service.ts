import { prisma } from '../config/prisma';

export class MembreService {
  async getAll() {
    return prisma.membre.findMany({
      orderBy: {
        id: 'asc'
      }
    });
  }

  async getById(id: number) {
    return prisma.membre.findUnique({
      where: { id }
    });
  }

 async create(data: {
  nom: string;
  telephone: string;
  mail: string;
  dateInscription?: string | Date;
  statutMembre?: string;
}) {
  return prisma.membre.create({
    data: {
      nom: data.nom,
      telephone: data.telephone,
      mail: data.mail,
      date_inscription: data.dateInscription
        ? new Date(data.dateInscription)
        : new Date(),
      statut_membre: data.statutMembre ?? 'ACTIF'
    }
  });
}

  async update(id: number, data: {
  nom?: string;
  telephone?: string;
  mail?: string;
  dateInscription?: string | Date;
  statutMembre?: string;
}) {
  return prisma.membre.update({
    where: { id },
    data: {
      nom: data.nom,
      telephone: data.telephone,
      mail: data.mail,
      date_inscription: data.dateInscription
        ? new Date(data.dateInscription)
        : undefined,
      statut_membre: data.statutMembre
    }
  });
}

  async delete(id: number) {
    return prisma.membre.delete({
      where: { id }
    });
  }
}

export const membreService = new MembreService();