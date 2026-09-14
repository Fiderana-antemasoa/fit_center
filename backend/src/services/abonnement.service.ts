import { prisma } from '../config/prisma';

export class AbonnementService {
  async getAll() {
    return prisma.abonnement.findMany({
      include: {
        membre: true
      },
      orderBy: {
        id: 'asc'
      }
    });
  }

  async getById(id: number) {
    return prisma.abonnement.findUnique({
      where: { id },
      include: {
        membre: true
      }
    });
  }

  async create(data: {
    type: string;
    dateDebut: string | Date;
    dateFin: string | Date;
    prix: number;
    statutAbonnement?: string;
    membreId: number;
  }) {
    return prisma.abonnement.create({
      data: {
        type: data.type,
        date_debut: new Date(data.dateDebut),
        date_fin: new Date(data.dateFin),
        prix: data.prix,
        statut_abonnement: data.statutAbonnement ?? 'ACTIF',
        membre_id: data.membreId
      },
      include: {
        membre: true
      }
    });
  }

  async update(id: number, data: {
    type?: string;
    dateDebut?: string | Date;
    dateFin?: string | Date;
    prix?: number;
    statutAbonnement?: string;
    membreId?: number;
  }) {
    return prisma.abonnement.update({
      where: { id },
      data: {
        type: data.type,
        date_debut: data.dateDebut
          ? new Date(data.dateDebut)
          : undefined,
        date_fin: data.dateFin
          ? new Date(data.dateFin)
          : undefined,
        prix: data.prix,
        statut_abonnement: data.statutAbonnement,
        membre_id: data.membreId
      },
      include: {
        membre: true
      }
    });
  }

  async delete(id: number) {
    return prisma.abonnement.delete({
      where: { id }
    });
  }
}

export const abonnementService = new AbonnementService();