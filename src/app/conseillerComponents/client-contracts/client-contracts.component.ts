import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContratService } from '../../services/contrat.service';

@Component({
  selector: 'app-client-contracts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-contracts.component.html',
  styleUrl: './client-contracts.component.css'
})
export class ClientContractsComponent implements OnInit {
  clients: any[] = []; // Liste des clients

  constructor(private contratService: ContratService) {}

  ngOnInit(): void {
    this.loadClients(); // Charger les données des clients au démarrage
  }

  private async loadClients(): Promise<void> {
    try {
      console.log('Chargement des clients...');
      this.clients = await this.contratService.getAllClients(); // Appel au service pour récupérer les clients
      console.log('Clients chargés:', this.clients);
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
    }
  }
}