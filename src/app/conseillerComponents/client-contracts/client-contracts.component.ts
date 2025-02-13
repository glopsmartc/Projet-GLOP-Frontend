import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContratService } from '../../services/contrat.service';

@Component({
  selector: 'app-client-contracts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-contracts.component.html',
  styleUrls: ['./client-contracts.component.css']
})
export class ClientContractsComponent implements OnInit {
  clients: any[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(private contratService: ContratService) {}

  ngOnInit(): void {
    this.loadClientContracts();
  }

  async loadClientContracts() {
    this.isLoading = true;
    this.errorMessage = null;
    try {
      const contracts = await this.contratService.getAllContratsFroConseiller();

      this.clients = contracts.map(contract => ({
        id: contract.id, // contract ID for download functionality
        clientNom: contract.clientNom || 'N/A',
        clientPrenom: contract.clientPrenom || 'N/A',
        telephone: contract.numeroTelephone || 'N/A',
        email: contract.client || 'N/A',
        statut: contract.statut || 'N/A',
        pdfPath: contract.pdfPath || 'N/A' // PDF path for download functionality
      }));

      console.log('Clients loaded:', this.clients);
    } catch (error) {
      console.error('Error loading client contracts:', error);
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
}
