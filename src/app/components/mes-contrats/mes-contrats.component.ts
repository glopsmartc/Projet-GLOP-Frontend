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
}