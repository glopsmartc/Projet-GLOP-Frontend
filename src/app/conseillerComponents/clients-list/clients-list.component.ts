import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContratService } from '../../services/contrat.service';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients: any[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  searchText: string = '';

  constructor(private contratService: ContratService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  async loadClients() {
    this.isLoading = true;
    this.errorMessage = null;
    try {
      this.clients = await this.contratService.getAllClients();
      console.log('Clients chargés:', this.clients);
    } catch (error) {
      this.errorMessage = 'Erreur lors du chargement des clients. Veuillez réessayer plus tard.';
    } finally {
      this.isLoading = false;
    }
  }
  filteredClients() {
    if (!this.searchText) {
      return this.clients;
    }
    return this.clients.filter(client =>
      (client.nom + ' ' + client.prenom).toLowerCase().includes(this.searchText.toLowerCase()) ||
      client.email?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      client.numTel?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
