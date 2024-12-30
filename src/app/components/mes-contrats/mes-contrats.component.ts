import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ContratService } from '../../services/contrat.service';

@Component({
  selector: 'app-mes-contrats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mes-contrats.component.html',
  styleUrl: './mes-contrats.component.css'
})
export class MesContratsComponent implements OnInit {
  contracts: any[] = [];

  // injection du service dans le constructeur
  constructor(private contratService: ContratService) {}

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
    } catch (error) {
      console.error('Erreur lors du chargement des contrats:', error);
    }
  }

  async onResilierContrat(contratId: string) {
    try {
      // Conversion de l'ID en nombre
      const contratIdNumber = parseInt(contratId, 10);
      if (isNaN(contratIdNumber)) {
        throw new Error(`L'ID fourni (${contratId}) n'est pas un nombre valide.`);
      }
  
      console.log(`Résiliation du contrat avec ID : ${contratIdNumber}...`);
      await this.contratService.resilierContrat(contratIdNumber); // Appel du service
      console.log(`Contrat avec ID : ${contratIdNumber} résilié.`);
      this.loadContracts(); // Recharger les contrats après résiliation
    } catch (error) {
      console.error('Erreur lors de la résiliation du contrat:', error);
    }
  }

}