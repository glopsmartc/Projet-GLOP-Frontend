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
  selectedSousPartenaireIds: number[] = [];
  sousPartenaireFilter: string = ''; // Filter for sous-partenaires table
  sousPartenaireSortColumn: string = ''; // Sorting column for sous-partenaires
  sousPartenaireSortAscending: boolean = true; // Sorting direction
  sortColumn: string = '';
  sortAscending: boolean = true;

  actions: { name: string; cost: number }[] = [];
  totalFrais: number = 0;

  existingActions: any[] = [];
  existingTotal: number = 0;
  newAction: any = { name: '', cost: 0 };

  newActions: any[] = [];
  newTotal: number = 0;

  selectedFiles: File[] = [];

  constructor(
    private readonly assistanceService: AssistanceService,
    private readonly partenaireService: PartenaireService
  ) { }

  ngOnInit() {
    this.loadRequests();
    this.loadAllSousPartenaires();
  }

  async loadRequests() {
    try {
      const response = await this.assistanceService.getAllRequests_Partenaire();
      this.requests = typeof response === 'string' ? JSON.parse(response) : response;
      this.requests.forEach(request => {
        if (Array.isArray(request.sousPartenaires)) {
          request.sous_partenaire = request.sousPartenaires.map((sp: any) => sp.idSousPartenaire);
        } else if (request.sousPartenaires) {
          request.sous_partenaire = [request.sousPartenaires.idSousPartenaire];
        } else {
          request.sous_partenaire = [];
        }
      });
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
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      this.allSousPartenaires = Array.isArray(data)
        ? data.map(sous_partenaire => ({
          id_sous_partenaire: sous_partenaire.idSousPartenaire,
          nomEntreprise: sous_partenaire.nomEntreprise,
          zoneGeographique: sous_partenaire.zoneGeographique,
          prenom: sous_partenaire.prenom,
          nom: sous_partenaire.nom,
          numTel: sous_partenaire.numTel,
          servicesProposes: sous_partenaire.servicesProposes
        }))
        : [];
    } catch (error) {
      console.error('Error loading sous-partenaires:', error);
      this.allSousPartenaires = [];
    }
  }

  async loadSousPartenaires() {
    for (const request of this.requests) {
      for (const sousPartenaireId of request.sous_partenaire) {
        if (!this.sousPartenaires[sousPartenaireId]) {
          try {
            const partenaireResponse = await this.partenaireService.obtenirSousPartenaireParId(sousPartenaireId);
            this.sousPartenaires[sousPartenaireId] = {
              nomEntreprise: partenaireResponse.nomEntreprise,
              zoneGeographique: partenaireResponse.zoneGeographique
            };
          } catch (error) {
            this.sousPartenaires[sousPartenaireId] = { nomEntreprise: 'Inconnu', zoneGeographique: 'Inconnue' };
          }
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
        valueA = a.sous_partenaire.map((id: number) => this.sousPartenaires[id]?.nomEntreprise || '').join(', ');
        valueB = b.sous_partenaire.map((id: number) => this.sousPartenaires[id]?.nomEntreprise || '').join(', ');
      }
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      if (this.sortAscending) {
        return valueA > valueB ? 1 : -1;
      }
      return valueA < valueB ? 1 : -1;
    });
  }

  async openDetails(request: any) {
    this.selectedRequest = request;
    this.selectedSousPartenaireIds = request.sous_partenaire ? [...request.sous_partenaire] : [];
    this.documents = await this.assistanceService.getDocumentsForRequest(request.idDossier);

    // Réinitialiser
    this.newAction = { name: '', cost: 0 };
    this.newActions = [];
    this.existingActions = [];
    this.existingTotal = 0;
    this.newTotal = 0;

    // Charger les actions existantes dans un tableau en lecture seule
    if (request.actionsRealisees) {
      request.actionsRealisees.forEach((actionStr: string) => {
        const [name, cost] = actionStr.split(',');
        const actionCost = parseFloat(cost) || 0;
        this.existingActions.push({ name, cost: actionCost });
        this.existingTotal += actionCost;
      });
    }
  }

  async saveChanges() {
    if (!this.selectedRequest) return;
    try {
      const currentSousPartenaireIds = Array.isArray(this.selectedRequest.sous_partenaire) ? this.selectedRequest.sous_partenaire : [];
      const newSousPartenaireIds = this.selectedSousPartenaireIds.filter(id => id !== null && id !== undefined && Number.isInteger(id) && id > 0);

      for (const id of currentSousPartenaireIds) {
        if (!newSousPartenaireIds.includes(id)) {
          await this.partenaireService.removeSousPartenaireFromDossier(id, this.selectedRequest.idDossier);
        }
      }

      for (const id of newSousPartenaireIds) {
        if (!currentSousPartenaireIds.includes(id)) {
          await this.partenaireService.assignSousPartenaireToRequest(id, this.selectedRequest.idDossier);
          const partenaireResponse = await this.partenaireService.obtenirSousPartenaireParId(id);
          this.sousPartenaires[id] = {
            nomEntreprise: partenaireResponse.nomEntreprise,
            zoneGeographique: partenaireResponse.zoneGeographique
          };
        }
      }

      this.selectedRequest.sous_partenaire = [...newSousPartenaireIds];

     /* // Enregistrer seulement les NOUVELLES actions
      if (this.newActions.length > 0) {
        await this.assistanceService.saveActions(
            this.selectedRequest.idDossier,
            this.newActions,
            this.newTotal
        );
      }*/
      //Uploader des factures
      if (this.selectedFiles.length > 0) {
        await this.assistanceService.uploadFactures(this.selectedRequest.idDossier, this.selectedFiles);
      }

      this.closeDetails();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
    }
  }

  closeDetails() {
    this.selectedRequest = null;
    this.documents = [];
    this.selectedSousPartenaireIds = [];
    this.sousPartenaireFilter = '';
  }

  filterRequests(): any[] {
    if (!Array.isArray(this.requests)) return [];
    if (!this.searchText) return this.requests;
    return this.requests.filter(request =>
      String(request.typeAssistance || '').toLowerCase().includes(this.searchText.toLowerCase()) ||
      request.sous_partenaire.some((id: number) =>
        this.sousPartenaires[id]?.nomEntreprise?.toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
  }

  getStatusClass(statut: string): string {
    if (!statut) return '';
    return `badge status-${statut.toLowerCase().replace(/\s+/g, '-')}`;
  }

  getPriorityClass(priorite: string): string {
    if (!priorite) return '';
    return `badge priority-${priorite.toLowerCase().replace(/\s+/g, '-')}`;
  }

  // New methods for sous-partenaires table
  toggleSousPartenaire(id: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedSousPartenaireIds.push(id);
    } else {
      this.selectedSousPartenaireIds = this.selectedSousPartenaireIds.filter(sid => sid !== id);
    }
  }

  toggleAllSousPartenaires(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedSousPartenaireIds = this.filteredSousPartenaires().map(sp => sp.id_sous_partenaire);
    } else {
      this.selectedSousPartenaireIds = [];
    }
  }

  filteredSousPartenaires(): any[] {
    if (!this.sousPartenaireFilter) return this.allSousPartenaires;
    return this.allSousPartenaires.filter(sp =>
      `${sp.prenom} ${sp.nom} ${sp.nomEntreprise} ${sp.zoneGeographique} ${sp.numTel} ${sp.servicesProposes}`
        .toLowerCase()
        .includes(this.sousPartenaireFilter.toLowerCase())
    );
  }

  sortSousPartenaires(column: string) {
    if (this.sousPartenaireSortColumn === column) {
      this.sousPartenaireSortAscending = !this.sousPartenaireSortAscending;
    } else {
      this.sousPartenaireSortColumn = column;
      this.sousPartenaireSortAscending = true;
    }

    this.allSousPartenaires.sort((a, b) => {
      let valueA = a[column] || '';
      let valueB = b[column] || '';
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();
      if (this.sousPartenaireSortAscending) {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
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


  async addAction() {
    if (this.newAction.name && this.newAction.cost) {
      try {
        // 1. Créer une copie de la nouvelle action
        const actionToAdd = {
          name: this.newAction.name,
          cost: parseFloat(this.newAction.cost) || 0
        };

        // 2. Sauvegarder les nouvelles actions
        await this.assistanceService.saveActions(
          this.selectedRequest.idDossier,
          [actionToAdd], // Envoyer uniquement la nouvelle action
          actionToAdd.cost
        );

        // 3. Mettre à jour l'affichage localement
        this.existingActions.push(actionToAdd);
        this.existingTotal += actionToAdd.cost;

        // 4. Réinitialiser le formulaire
        this.newAction = { name: '', cost: 0 };
        this.newActions = [];
        this.newTotal = 0;

      } catch (error) {
        console.error("Erreur lors de l'ajout de l'action", error);
        // Optionnel : Afficher un message d'erreur à l'utilisateur
      }
    }
  }

  removeNewAction(index: number) {
    const removedAction = this.newActions.splice(index, 1)[0];
    this.newTotal -= parseFloat(removedAction.cost) || 0;
}

removeExistingAction(index: number) {
    const removedAction = this.existingActions.splice(index, 1)[0];
    this.existingTotal -= parseFloat(removedAction.cost) || 0;
    // Ici je peut aussi appeler une API pour supprimer l'action de la base de données
}

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;

    for (let i = 0; i < files.length; i++) {
      if (files[i].type === 'application/pdf') {
        this.selectedFiles.push(files[i]);
      } else {
        alert(`Le fichier ${files[i].name} n'est pas un PDF.`);
      }
    }

    event.target.value = ""; //mm fichier
  }

  async uploadFiles() {
    if (!this.selectedRequest || !this.selectedFiles || this.selectedFiles.length === 0) {
      console.warn("Aucun fichier sélectionné pour l'upload.");
      return;
    }

    try {
      await this.assistanceService.uploadFactures(this.selectedRequest.idDossier, this.selectedFiles);
      console.log('Factures uploadées avec succès !');
      this.selectedFiles = []; // Vider la liste après upload
    } catch (error) {
      console.error('Erreur lors de l\'upload des factures:', error);
    }
  }

}
