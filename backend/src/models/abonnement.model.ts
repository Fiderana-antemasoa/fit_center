export interface Abonnement {
  id: number;
  type: string;
  date_debut: Date;
  date_fin: Date;
  prix: number;
  statut_abonnement: string;
  membre_id: number;
}