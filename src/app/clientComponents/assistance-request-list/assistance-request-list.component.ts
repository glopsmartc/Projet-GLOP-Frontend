import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssistanceService } from '../services/assistance.service';

@Component({
  selector: 'app-assistance-request-list',
  templateUrl: './assistance-request-list.component.html',
  styleUrls: ['./assistance-request-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AssistanceRequestListComponent implements OnInit {
  requests: any[] = []; // Stocke les demandes d'assistance
  loading: boolean = true; // Variable pour afficher un chargement
  errorMessage: string | null = null; // Stocke un message d'erreur si besoin

  constructor(private assistanceService: AssistanceService) {}

  ngOnInit() {
    this.loadRequests(); // Charge les demandes au démarrage
  }

  async loadRequests() {
    try {
      this.requests = await this.assistanceService.getAllRequests();
      this.loading = false;
    } catch (error) {
      this.errorMessage = 'Impossible de charger les demandes d\'assistance.';
      this.loading = false;
    }
  }

  // Méthode pour définir la classe CSS du statut
  getStatusClass(statut: string): string {
    return `badge status-${statut.toLowerCase().replace(' ', '-')}`;
  }

  // Méthode pour définir la classe CSS de la priorité
  getPriorityClass(priorite: string): string {
    return `badge priority-${priorite.toLowerCase()}`;
  }
}
