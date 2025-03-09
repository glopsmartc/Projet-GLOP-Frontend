import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assistance-request-list',
  templateUrl: './assistance-request-list.component.html',
  styleUrls: ['./assistance-request-list.component.css'],
  standalone: true, // Si ton projet utilise des standalone components
  imports: [CommonModule] // Import nécessaire pour les pipes comme 'date'
})
export class AssistanceRequestListComponent {
  // Liste des demandes d'assistance simulée
  requests = [
    {
      libelle: 'Problème de connexion',
      statut: 'En attente',
      priorite: 'Urgent',
      dateDemande: new Date('2023-02-01T10:15:00')
    },
    {
      libelle: 'Erreur serveur',
      statut: 'En cours',
      priorite: 'Normal',
      dateDemande: new Date('2023-02-02T12:45:00')
    },
    {
      libelle: 'Réinitialisation de mot de passe',
      statut: 'Accepté',
      priorite: 'Faible',
      dateDemande: new Date('2023-02-03T14:30:00')
    }
  ];

  // Méthode pour définir la classe CSS du statut
  getStatusClass(statut: string): string {
    return `badge status-${statut.toLowerCase().replace(' ', '-')}`;
  }

  // Méthode pour définir la classe CSS de la priorité
  getPriorityClass(priorite: string): string {
    return `badge priority-${priorite.toLowerCase()}`;
  }
}
