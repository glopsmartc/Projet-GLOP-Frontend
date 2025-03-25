import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssistanceService } from '../../services/assistance.service';

@Component({
  selector: 'app-assistance-request-list',
  templateUrl: './assistance-request-list.component.html',
  styleUrls: ['./assistance-request-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AssistanceRequestListComponent implements OnInit {
  requests: any[] = []; // Liste des demandes d'assistance
  loading: boolean = true; // Indicateur de chargement
  errorMessage: string | null = null; // Gestion des erreurs
  selectedRequest: any | null = null; // Stocke la demande sélectionnée
  documents: any[] = []; // Liste des fichiers joints

  constructor(private readonly assistanceService: AssistanceService) { }

  ngOnInit() {
    this.loadRequests();
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

  async openDetails(request: any) {
    this.selectedRequest = request;
    this.documents = request.documents || [];
  }

  closeDetails() {
    this.selectedRequest = null;
    this.documents = [];
  }

  getStatusClass(statut: string): string {
    if (!statut) return '';
    return `badge status-${statut.toLowerCase().replace(/\s+/g, '-')}`;
  }

  getPriorityClass(priorite: string): string {
    if (!priorite) return '';
    return `badge priority-${priorite.toLowerCase().replace(/\s+/g, '-')}`;
  }

  async downloadDocument(path: string) {
    try {
      const blob = await this.assistanceService.downloadDocument(path);
      const url = window.URL.createObjectURL(blob);

      window.open(url);


    } catch (err) {
      console.error('Erreur de téléchargement :', err);
    }
  }

  // New method to extract filename from path
  getFileNameFromPath(filePath: string): string {
    if (!filePath) return '';
    // Split by both \ and /, filter out empty segments, and take the last one
    const segments = filePath.split(/[\\/]/).filter(segment => segment);
    return segments[segments.length - 1];
  }

}
