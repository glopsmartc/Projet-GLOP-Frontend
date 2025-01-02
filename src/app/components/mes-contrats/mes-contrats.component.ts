import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ContratService } from '../../services/contrat.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationResiliationComponent } from '../../confirmation-resiliation/confirmation-resiliation.component';

@Component({
  selector: 'app-mes-contrats',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './mes-contrats.component.html',
  styleUrl: './mes-contrats.component.css'
})
export class MesContratsComponent implements OnInit {
  contracts: any[] = [];
  filteredContracts: any[] = []; // Contrats filtrés à afficher
  activeFilter: string = 'all'; // Filtre actif ('all', 'actif', 'terminé', 'résilié')

  // injection du service dans le constructeur
  constructor(private contratService: ContratService, private dialog: MatDialog) {}

  // recuperation des contrats au chargement du composant
  ngOnInit(): void {
    this.loadContracts();
  }

  // méthode pour charger les contrats
  private async loadContracts() {
    try {
      console.log('Chargement des contrats...');
      this.contracts = await this.contratService.getUserContracts(); // Appel du service
      console.log('Contrats chargés:', this.contracts);
      this.applyFilter(); // Appliquer le filtre actuel
    } catch (error) {
      console.error('Erreur lors du chargement des contrats:', error);
    }
  }

  filterContracts(filter: string) {
    this.activeFilter = filter; // Met à jour le filtre actif
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
  }

  async onResilierContrat(contratId: string) {
    try {
      //ouvre la boîte de dialogue de confirmation
      const dialogRef = this.dialog.open(ConfirmationResiliationComponent);
      //attendre que la boîte de dialogue soit fermée et récupérer la réponse
      const result = await dialogRef.afterClosed().toPromise();

      if (result) {
          // Conversion de l'ID en nombre
          const contratIdNumber = parseInt(contratId, 10);
          if (isNaN(contratIdNumber)) {
            throw new Error(`L'ID fourni (${contratId}) n'est pas un nombre valide.`);
          }
      
          console.log(`Résiliation du contrat avec ID : ${contratIdNumber}...`);
          await this.contratService.resilierContrat(contratIdNumber); // Appel du service
          console.log(`Contrat avec ID : ${contratIdNumber} résilié.`);
          this.loadContracts(); // Recharger les contrats après résiliation
      } else {
          console.log('Action de résiliation annulée.');
      }

    } catch (error) {
      console.error('Erreur lors de la résiliation du contrat:', error);
    }
  }

}