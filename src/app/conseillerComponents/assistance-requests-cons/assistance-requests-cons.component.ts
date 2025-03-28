import { Component, OnInit } from '@angular/core';
import { AssistanceService } from '../../services/assistance.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assistance-requests-cons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assistance-requests-cons.component.html',
  styleUrl: './assistance-requests-cons.component.css'
})
export class AssistanceRequestsConsComponent implements OnInit {
  requests: any[] = []; // Liste des demandes d'assistance
  loading: boolean = true; // Indicateur de chargement
  errorMessage: string | null = null; // Gestion des erreurs
  selectedRequest: any | null = null; // Stocke la demande sélectionnée
  documents: any[] = []; // Liste des fichiers joints

  constructor(private assistanceService: AssistanceService) { }

  ngOnInit() {
    this.loadRequests();
  }

  async loadRequests() {
    try {
      this.requests = await this.assistanceService.getAllRequests_Conseiller_Logisticien();
      this.loading = false;
    } catch (error) {
      this.errorMessage = 'Impossible de charger les demandes d\'assistance.';
      this.loading = false;
    }
  }

  async openDetails(request: any) {
    this.selectedRequest = request;
    this.documents = await this.assistanceService.getDocumentsForRequest(request.id);
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

  async cloturerRequest() {
    if (this.selectedRequest) {
      try {
        await this.assistanceService.updateStatut(this.selectedRequest.idDossier, 'Cloturé');
        this.selectedRequest.statutDossier = 'Cloturé';
        alert('Le dossier a été clôturé avec succès.');
      } catch (error) {
        console.error('Erreur lors de la clôture du dossier:', error);
        alert('Une erreur est survenue lors de la clôture du dossier.');
      }
    }
  }
}
