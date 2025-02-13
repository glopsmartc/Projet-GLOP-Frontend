export interface AssistanceRequest {
  id: number;
  libelle: string;
  statut: 'Nouvelle' | 'En cours' | 'Traité';
  priorite: 'Basse' | 'Moyenne' | 'Haute';
  dateDemande: Date;
}
