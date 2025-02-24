import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContratService } from '../../services/contrat.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-contracts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-contracts.component.html',
  styleUrls: ['./client-contracts.component.css']
})
export class ClientContractsComponent implements OnInit {
  groupedClients: any[] = []; // Clients regroupés avec leurs contrats
  isLoading: boolean = false;
  errorMessage: string | null = null;
  searchText: string = '';

  constructor(private contratService: ContratService) {}

  ngOnInit(): void {
    this.loadClientContracts();
  }

  async loadClientContracts() {
    this.isLoading = true;
    this.errorMessage = null;
    try {
      const contracts = await this.contratService.getAllContratsFroConseiller();

      // Regroupement des contrats par client
      const clientMap = new Map();
      contracts.forEach(contract => {
        const key = `${contract.clientNom}-${contract.clientPrenom}`;
        if (!clientMap.has(key)) {
          clientMap.set(key, {
            nom: contract.clientNom || 'N/A',
            prenom: contract.clientPrenom || 'N/A',
            telephone: contract.numeroTelephone || 'N/A',
            email: contract.client || 'N/A',
            contrats: [],
            showContracts: false
          });
        }
        clientMap.get(key).contrats.push({
          id: contract.id,
          statut: contract.statut || 'N/A',
          pdfPath: contract.pdfPath || 'N/A'
        });
      });

      this.groupedClients = Array.from(clientMap.values());
      console.log('Clients regroupés:', this.groupedClients);
    } catch (error) {
      console.error('Erreur lors du chargement des contrats:', error);
      this.errorMessage = 'Erreur lors du chargement des contrats. Veuillez réessayer plus tard.';
    } finally {
      this.isLoading = false;
    }
  }

  async onDownloadContract(contractId: string) {
    try {
      const blob = await this.contratService.downloadContractFile(contractId);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contrat_${contractId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      console.log('Contrat téléchargé avec succès.');
    } catch (error) {
      console.error('Erreur lors du téléchargement du contrat:', error);
      this.errorMessage = 'Erreur lors du téléchargement du contrat. Veuillez réessayer plus tard.';
    }
  }

  filteredClients() {
    if (!this.searchText) {
      return this.groupedClients;
    }
    return this.groupedClients.filter(client =>
      (client.nom + ' ' + client.prenom).toLowerCase().includes(this.searchText.toLowerCase())
    );
  }  
}