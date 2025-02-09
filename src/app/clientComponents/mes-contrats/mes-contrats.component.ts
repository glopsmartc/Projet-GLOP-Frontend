import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContratService } from '../../services/contrat.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationResiliationComponent } from '../confirmation-resiliation/confirmation-resiliation.component';

@Component({
  selector: 'app-mes-contrats',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './mes-contrats.component.html',
  styleUrls: ['./mes-contrats.component.css']
})
export class MesContratsComponent implements OnInit {
  contracts: any[] = [];
  filteredContracts: any[] = []; // Contrats filtrés à afficher
  activeFilter: string = 'all'; // Filtre actif ('all', 'actif', 'terminé', 'résilié')

  // Variables pour la pagination
  currentPage: number = 1;
  contractsPerPage: number = 6;

  constructor(private contratService: ContratService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadContracts();
  }

  // méthode pour charger les contrats
  private async loadContracts() {
    try {
      console.log('Chargement des contrats...');
      this.contracts = await this.contratService.getUserContracts();
      console.log('Contrats chargés:', this.contracts);
      this.applyFilter();
    } catch (error) {
      console.error('Erreur lors du chargement des contrats:', error);
    }
  }

  filterContracts(filter: string) {
    this.activeFilter = filter;
    this.applyFilter();
  }

  private applyFilter() {
    if (this.activeFilter === 'all') {
      this.filteredContracts = this.contracts; // Tous les contrats
    } else {
      this.filteredContracts = this.contracts.filter(
        contract => contract.statut === this.activeFilter
      );
    }

    // Trier les contrats par ID de manière décroissante
    this.filteredContracts.sort((a, b) => b.id - a.id);
  }

  // Pagination : obtenir les contrats à afficher pour la page actuelle
  getPaginatedContracts() {
    const start = (this.currentPage - 1) * this.contractsPerPage;
    const end = start + this.contractsPerPage;
    return this.filteredContracts.slice(start, end);
  }

  // Méthode pour changer de page
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  // Méthode pour obtenir le nombre total de pages
  get totalPages() {
    return Math.ceil(this.filteredContracts.length / this.contractsPerPage);
  }

  async onResilierContrat(contratId: string) {
    try {
      const dialogRef = this.dialog.open(ConfirmationResiliationComponent);
      const result = await dialogRef.afterClosed().toPromise();

      if (result) {
        const contratIdNumber = parseInt(contratId, 10);
        if (isNaN(contratIdNumber)) {
          throw new Error(`L'ID fourni (${contratId}) n'est pas un nombre valide.`);
        }

        console.log(`Résiliation du contrat avec ID : ${contratIdNumber}...`);
        await this.contratService.resilierContrat(contratIdNumber);
        console.log(`Contrat avec ID : ${contratIdNumber} résilié.`);
        this.loadContracts(); // Recharger les contrats après résiliation
      } else {
        console.log('Action de résiliation annulée.');
      }

    } catch (error) {
      console.error('Erreur lors de la résiliation du contrat:', error);
    }
  }

  async onDownloadContract(contractId: string) {
    try {
      console.log(`Téléchargement du contrat avec l'ID : ${contractId}...`);
      // Appeler le service pour récupérer le fichier du contrat
      const fileBlob = await this.contratService.downloadContractFile(contractId);

      // Créer une URL pour le fichier téléchargé
      const url = window.URL.createObjectURL(fileBlob);

      // Créer un lien temporaire pour lancer le téléchargement
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `contrat_${contractId}.pdf`;
      anchor.click();

      // Libérer l'URL créée
      window.URL.revokeObjectURL(url);

      console.log(`Contrat avec l'ID ${contractId} téléchargé avec succès.`);
    } catch (error) {
      console.error(`Erreur lors du téléchargement du contrat avec l'ID ${contractId}:`, error);
    }
  }
}
