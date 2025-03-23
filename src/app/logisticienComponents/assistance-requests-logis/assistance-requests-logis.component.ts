import { Component, OnInit } from '@angular/core';
import { AssistanceService } from '../../services/assistance.service';
import { PartenaireService } from '../../services/partenaire.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assistance-requests-logis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assistance-requests-logis.component.html',
  styleUrl: './assistance-requests-logis.component.css'
})
export class AssistanceRequestsLogisComponent implements OnInit {
  requests: any[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;
  selectedRequest: any | null = null;
  documents: any[] = [];
  searchText: string = '';
  partenaires: { [key: number]: any } = {};
  allPartenaires: any[] = [];
  editingPartenaire: { [key: number]: boolean } = {};
  processingAssignment: { [key: number]: boolean } = {};

  constructor(
    private assistanceService: AssistanceService,
    private partenaireService: PartenaireService
  ) {}

  ngOnInit() {
    this.loadRequests();
    this.loadAllPartenaires();
  }

  async loadRequests() {
    try {
      this.requests = await this.assistanceService.getAllRequests_Conseiller_Logisticien();
      await this.loadPartenaires();
      this.loading = false;
    } catch (error) {
      this.errorMessage = 'Impossible de charger les demandes d\'assistance.';
      this.loading = false;
    }
  }

  async loadAllPartenaires() {
    try {
      const allPartenaires = await this.partenaireService.getAllPartenaires();
      this.allPartenaires = allPartenaires.map(partenaire => ({
        idUser: partenaire.idUser,
        nomEntreprise: partenaire.nomEntreprise,
        zoneGeographique: partenaire.zoneGeographique
      }));
      console.log('Tous les partenaires chargés:', this.allPartenaires);
    } catch (error) {
      console.error('Erreur lors de la récupération de tous les partenaires:', error);
    }
  }

  async loadPartenaires() {
    for (const request of this.requests) {
      if (request.partenaire && !this.partenaires[request.partenaire]) {
        try {
          const partenaireResponse = await this.partenaireService.getPartenaireById(request.partenaire);
          this.partenaires[request.partenaire] = {
            nomEntreprise: partenaireResponse.nomEntreprise,
            zoneGeographique: partenaireResponse.zoneGeographique
          };
        } catch (error) {
          console.error('Erreur lors de la récupération du partenaire:', error);
          this.partenaires[request.partenaire] = { nomEntreprise: 'Inconnu', zoneGeographique: 'Inconnue' };
        }
      }
    }
  }
  selectedPartenaireId: number | null = null;
  togglePartenaireEdit(requestId: number) {
    this.editingPartenaire[requestId] = !this.editingPartenaire[requestId];
    const request = this.requests.find(r => r.idDossier === requestId);
    this.selectedPartenaireId = request?.partenaire || null;
  }

  async assignPartenaire(requestId: number, partenaireId: number | null) {
    console.log(`Assigning partenaire ${partenaireId} to request ${requestId}`);

    if (isNaN(partenaireId as number)) {
      partenaireId = null; // Ensure partenaireId is null if it's NaN
    }

    this.processingAssignment[requestId] = true;

    try {
      if (partenaireId === null) {
        // Call API to remove partenaire assignment
        await this.assistanceService.removePartenaireFromDossier(requestId);

        // Update local data
        const updatedRequest = this.requests.find(r => r.idDossier === requestId);
        if (updatedRequest) {
          updatedRequest.partenaire = null; // Update the local state
          delete this.partenaires[requestId]; // Remove from partenaires object if needed
        }
      } else {
        // Call API to assign partenaire
        await this.assistanceService.assignPartenaireToRequest(partenaireId, requestId);

        // Update local data
        const updatedRequest = this.requests.find(r => r.idDossier === requestId);
        if (updatedRequest) {
          updatedRequest.partenaire = partenaireId; // Update the local state

          // Update the partenaires object
          const partenaireResponse = await this.partenaireService.getPartenaireById(partenaireId);
          this.partenaires[partenaireId] = {
            nomEntreprise: partenaireResponse.nomEntreprise,
            zoneGeographique: partenaireResponse.zoneGeographique
          };
        }
      }

      this.editingPartenaire[requestId] = false;
    } catch (error) {
      console.error('Erreur lors de l\'assignation du partenaire:', error);
    } finally {
      this.processingAssignment[requestId] = false;
    }
  }

  filterRequests(): any[] {
    if (!this.searchText) return this.requests;
    return this.requests.filter(request =>
      String(request.typeAssistance || '').toLowerCase().includes(this.searchText.toLowerCase()) ||
      String(request.partenaire ? this.partenaires[request.partenaire]?.nomEntreprise || '' : '').toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  async openDetails(request: any) {
    this.selectedRequest = request;
    this.documents = await this.assistanceService.getDocumentsForRequest(request.idDossier);
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



  // Variables for status editing
editingStatut: { [key: number]: boolean } = {};
selectedStatut: string = '';
processingStatutUpdate: { [key: number]: boolean } = {};

// Toggle status edit mode
toggleStatutEdit(requestId: number) {
  this.editingStatut[requestId] = !this.editingStatut[requestId];
  const request = this.requests.find(r => r.idDossier === requestId);
  this.selectedStatut = request?.statutDossier || '';
}

// Update status
async updateStatut(requestId: number, newStatut: string) {
  this.processingStatutUpdate[requestId] = true;

  try {
    // Call API to update status
    await this.assistanceService.updateStatut(requestId, newStatut);

    // Update local data
    const updatedRequest = this.requests.find(r => r.idDossier === requestId);
    if (updatedRequest) {
      updatedRequest.statutDossier = newStatut; // Update the local state
    }

    this.editingStatut[requestId] = false;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
  } finally {
    this.processingStatutUpdate[requestId] = false;
  }
}
}
