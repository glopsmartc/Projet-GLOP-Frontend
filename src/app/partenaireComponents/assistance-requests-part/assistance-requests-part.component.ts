import { Component, OnInit } from '@angular/core';
import { AssistanceService } from '../../services/assistance.service';
import { PartenaireService } from '../../services/partenaire.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assistance-requests-part',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assistance-requests-part.component.html',
  styleUrl: './assistance-requests-part.component.css'
})
export class AssistanceRequestsPartComponent implements OnInit {
  requests: any[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;
  selectedRequest: any = null;
  documents: any[] = [];
  searchText: string = '';
  sousPartenaires: { [key: number]: any } = {};
  allSousPartenaires: any[] = [];
  editingSousPartenaire: { [key: number]: boolean } = {};
  processingAssignment: { [key: number]: boolean } = {};

  selectedSousPartenaireId: number | null = null;

  // Variables for status editing
  editingStatut: { [key: number]: boolean } = {};
  selectedStatut: string = '';
  processingStatutUpdate: { [key: number]: boolean } = {};

  sortColumn: string = '';
  sortAscending: boolean = true;

  constructor(
    private readonly assistanceService: AssistanceService,
    private readonly partenaireService: PartenaireService
  ) {}

  ngOnInit() {
    this.loadRequests();
    this.loadAllSousPartenaires();
  }

  async loadRequests() {
    try {
      const response = await this.assistanceService.getAllRequests_Partenaire();

      // Check if response is a string (unparsed JSON)
      if (typeof response === 'string') {
        this.requests = JSON.parse(response); // Parse if string
      } else {
        this.requests = response; // Use directly if already an array
      }

      await this.loadSousPartenaires();
      this.loading = false;
    } catch (error) {
      this.errorMessage = 'Impossible de charger les demandes d\'assistance.';
      this.loading = false;
    }
  }


  async loadAllSousPartenaires() {
    try {
      const response = await this.partenaireService.getAllSousPartenaires();
      console.log('API Response:', response); // Debug raw response

      // Ensure we parse the response if it's a string
      const data = typeof response === 'string' ? JSON.parse(response) : response;

      // Now safely use .map()
      this.allSousPartenaires = Array.isArray(data)
        ? data.map(sous_partenaire => ({
            id_sous_partenaire: sous_partenaire.id_sous_partenaire,
            nomEntreprise: sous_partenaire.nomEntreprise,
            zoneGeographique: sous_partenaire.zoneGeographique,
            prenom: sous_partenaire.prenom,
            nom: sous_partenaire.nom
          }))
        : [];
    } catch (error) {
      console.error('Error loading sous-partenaires:', error);
      this.allSousPartenaires = []; // Fallback to empty array
    }
  }

  async loadSousPartenaires() {
    for (const request of this.requests) {
      if (request.sous_partenaire && !this.sousPartenaires[request.sous_partenaire]) {
        try {
          const partenaireResponse = await this.partenaireService.obtenirSousPartenaireParId(request.sous_partenaire);
          this.sousPartenaires[request.sous_partenaire] = {
            nomEntreprise: partenaireResponse.nomEntreprise,
            zoneGeographique: partenaireResponse.zoneGeographique
          };
        } catch (error) {
          console.error('Erreur lors de la récupération du sous-sous_partenaire:', error);
          this.sousPartenaires[request.sous_partenaire] = { nomEntreprise: 'Inconnu', zoneGeographique: 'Inconnue' };
        }
      }
    }
  }

  sortRequests(column: string) {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }

    this.requests.sort((a, b) => {
      let valueA = a[column] || '';
      let valueB = b[column] || '';

      if (column === 'sous_partenaire') {
        valueA = this.sousPartenaires[a.sous_partenaire]?.nomEntreprise || '';
        valueB = this.sousPartenaires[b.sous_partenaire]?.nomEntreprise || '';
      }

      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      let result: number;
      if (this.sortAscending) {
        result = valueA > valueB ? 1 : -1;
      } else {
        result = valueA < valueB ? 1 : -1;
      }
      return result;
    });
  }

  togglePartenaireEdit(requestId: number) {
    this.editingSousPartenaire[requestId] = !this.editingSousPartenaire[requestId];
    const request = this.requests.find(r => r.idDossier === requestId);
    this.selectedSousPartenaireId = request?.sous_partenaire || null;
  }

  async assignPartenaire(requestId: number, id_sous_partenaire: number | null) {
    console.log(`Assigning sous_partenaire ${id_sous_partenaire} to request ${requestId}`);

    if (isNaN(id_sous_partenaire as number)) {
      id_sous_partenaire = null; // Ensure id_sous_partenaire is null if it's NaN
    }

    this.processingAssignment[requestId] = true;

    try {
      if (id_sous_partenaire === null) {
        // Get the current sous_partenaire ID from the request
        const request = this.requests.find(r => r.idDossier === requestId);
        const currentSousPartenaireId = request?.sous_partenaire;

        if (currentSousPartenaireId) {
          // Call API with both IDs
          await this.partenaireService.removeSousPartenaireFromDossier(
            currentSousPartenaireId,
            requestId
          );
        }

        // Update local data
        const updatedRequest = this.requests.find(r => r.idDossier === requestId);
        if (updatedRequest) {
          updatedRequest.sous_partenaire = null; // Update the local state
          delete this.sousPartenaires[requestId]; // Remove from sousPartenaires object if needed
        }
      } else {
        // Call API to assign sous_partenaire
        await this.partenaireService.assignSousPartenaireToRequest(id_sous_partenaire, requestId);

        // Update local data
        const updatedRequest = this.requests.find(r => r.idDossier === requestId);
        if (updatedRequest) {
          updatedRequest.sous_partenaire = id_sous_partenaire; // Update the local state

          // Update the sousPartenaires object
          const partenaireResponse = await this.partenaireService.obtenirSousPartenaireParId(id_sous_partenaire);
          this.sousPartenaires[id_sous_partenaire] = {
            nomEntreprise: partenaireResponse.nomEntreprise,
            zoneGeographique: partenaireResponse.zoneGeographique
          };
        }
      }

      this.editingSousPartenaire[requestId] = false;
    } catch (error) {
      console.error('Erreur lors de l\'assignation du sous_partenaire:', error);
    } finally {
      this.processingAssignment[requestId] = false;
    }
  }

  filterRequests(): any[] {
    if (!Array.isArray(this.requests)) {
      console.error('this.requests is not an array:', this.requests);
      return [];
    }

    if (!this.searchText) return this.requests;

    return this.requests.filter(request =>
      String(request.typeAssistance || '').toLowerCase().includes(this.searchText.toLowerCase()) ||
      String(request.sous_partenaire ? this.sousPartenaires[request.sous_partenaire]?.nomEntreprise || '' : '').toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  async openDetails(request: any) {
    this.selectedRequest = request;
    this.selectedStatut = request.statutDossier;
    this.selectedSousPartenaireId = request.sous_partenaire;
    this.documents = await this.assistanceService.getDocumentsForRequest(request.idDossier);
  }
  async saveChanges() {
    if (!this.selectedRequest) return;

    try {
      // Update statut
      if (this.selectedRequest.statutDossier !== this.selectedStatut) {
        await this.assistanceService.updateStatut(this.selectedRequest.idDossier, this.selectedStatut);
        this.selectedRequest.statutDossier = this.selectedStatut; // Update local state
      }

      // Update sous_partenaire
      if (this.selectedRequest.sous_partenaire !== this.selectedSousPartenaireId) {
        if (this.selectedSousPartenaireId === null) {
          // Fix: Pass both the sous_partenaire ID and the dossier ID
          const currentSousPartenaireId = this.selectedRequest.sous_partenaire;
          if (currentSousPartenaireId) {
            await this.partenaireService.removeSousPartenaireFromDossier(
              currentSousPartenaireId,
              this.selectedRequest.idDossier
            );
          }
          this.selectedRequest.sous_partenaire = null; // Update local state
        } else {
          await this.assistanceService.assignPartenaireToRequest(this.selectedSousPartenaireId, this.selectedRequest.idDossier);
          this.selectedRequest.sous_partenaire = this.selectedSousPartenaireId; // Update local state

          // Update the sousPartenaires object
          const partenaireResponse = await this.partenaireService.obtenirSousPartenaireParId(this.selectedSousPartenaireId);
          this.sousPartenaires[this.selectedSousPartenaireId] = {
            nomEntreprise: partenaireResponse.nomEntreprise,
            zoneGeographique: partenaireResponse.zoneGeographique
          };
        }
      }
      this.selectedRequest = null;
      this.documents = [];

    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des modifications:', error);
      alert('Erreur lors de l\'enregistrement des modifications');
    }
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
