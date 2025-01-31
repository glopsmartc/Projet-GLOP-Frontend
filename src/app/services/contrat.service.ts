import { Injectable } from '@angular/core';
import axios from 'axios';
import { AuthService } from './auth.service';

declare const window: any;

@Injectable({
  providedIn: 'root',
})
export class ContratService {
  private apiUrl: string;

  constructor(private authService: AuthService) {
    this.apiUrl = this.getApiUrl();
  }

  private getApiUrl(): string {
    if (typeof window !== 'undefined' && window?.config?.apiBaseUrlContrat) {
      return `${window.config.apiBaseUrlContrat}/api/contrat`;
    } else {
      console.warn('window.config is not available or window is undefined');
      return '';
    }
  }

  private getAuthHeaders() {
    const token = this.authService.getToken();
    console.log('Token utilisé pour l\'authentification:', token);
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

   // Méthode pour récupérer les contrats de l'utilisateur connecté
   async getUserContracts(): Promise<any> {
    try {
      console.log('Envoi de la requête pour récupérer les contrats de l\'utilisateur (GET):');
      const response = await axios.get(`${this.apiUrl}/user-contracts`, this.getAuthHeaders());
      console.log('Réponse des contrats de l\'utilisateur:', response.data);
      return response.data;  // Retourne les contrats de l'utilisateur
    } catch (error: unknown) {
      console.error('Erreur lors de la récupération des contrats de l\'utilisateur (GET):', error);
      throw error;  // Re-throw the error for further handling
    }
  }


  // Méthode pour récupérer l'offre correspondante
  async getOffreCorrespondante(request: any): Promise<any> {
    try {
        console.log('Envoi de la requête pour l\'offre correspondante (POST):', request);
        const response = await axios.post(`${this.apiUrl}/getOffre`, request, this.getAuthHeaders());
        console.log('Réponse des offres correspondantes (POST):', response);
        return response.data;
    } catch (error: unknown) {
        console.error('Erreur lors de la récupération des offres (POST):', error);
        throw error;
    }
  }

  async createContract(request: any, pdfFile: File) {
    try {
      const formData = new FormData();
      formData.append('request', JSON.stringify(request)); // Add contract data
      formData.append('file', pdfFile); // Add the PDF file

      console.log('Envoi de la requête pour créer le contrat :', request);

      // Call the API to create the contract
      const response = await axios.post(`${this.apiUrl}/create`, formData, {
        headers: {
          ...this.getAuthHeaders().headers,
          Accept: 'application/json',
        },
      });

      console.log('Réponse du backend (contrat créé avec offre) :', response.data);
      return response.data; // Return the contract data
    } catch (error) {
      console.error('Erreur lors de la création du contrat ou de l\'upload du fichier :', error);
      throw error; // Re-throw the error for further handling
    }
  }

  async getCurrentUserEmail(): Promise<string> {
    try {
      const response = await axios.get(`${this.apiUrl}/current-user`, this.getAuthHeaders());
      const currentUser = response.data;
      return currentUser.email;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
      throw error;
    }
  }

  // consulter toutes les offres
  async getAllOffres(): Promise<any[]> {
    try {
      console.log('Envoi de la requête pour récupérer toutes les offres');
      const response = await axios.get(`${this.apiUrl}/allOffers`, this.getAuthHeaders());
      console.log('Réponse des offres disponibles :', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des offres :', error);
      throw error;
    }
  }

  // consulter un seul contrat
  async getContratById(id: number): Promise<any> {
    try {
      console.log(`Envoi de la requête pour récupérer le contrat avec l'ID ${id}`);
      const response = await axios.get(`${this.apiUrl}/${id}`, this.getAuthHeaders());
      console.log('Réponse du contrat récupéré :', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du contrat avec l'ID ${id} :`, error);
      throw error;
    }
  }

  // consulter tous les contrats
  async getAllContrats(): Promise<any[]> {
    try {
      console.log('Envoi de la requête pour récupérer tous les contrats');
      const response = await axios.get(this.apiUrl, this.getAuthHeaders());
      console.log('Réponse des contrats disponibles :', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des contrats :', error);
      throw error;
    }
  }

  // consulter tous les contrats
  async getAllContratsFroConseiller(): Promise<any[]> {
    try {
      console.log('Envoi de la requête pour récupérer tous les contrats');
      const response = await axios.get(`${this.apiUrl}/`, this.getAuthHeaders()); // Add trailing slash
      console.log('Réponse des contrats disponibles :', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des contrats :', error);
      throw error;
    }
  }


  async getCurrentUser(): Promise<{ email: string; nom: string,  prenom: string }> {
    try {
      const response = await axios.get(`${this.apiUrl}/current-user`, this.getAuthHeaders());
      const currentUser = response.data; // Assurez-vous que `nom` est un champ retourné par votre backend
      return { email: currentUser.email, nom: currentUser.nom, prenom: currentUser.prenom }; // Retourne le nom et l'email
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
      throw error;
    }
  }


  //methode pour resilier contrat
  async resilierContrat(id: number): Promise<void> {
    try {
        const response = await axios.patch(
            `${this.apiUrl}/${id}/resilier`,
            {},
            this.getAuthHeaders()
        );
        console.log('Contrat résilié avec succès:', response.data);
    } catch (error: any) {
        // Gestion détaillée de l'erreur
        if (error.response) {
            console.error('Erreur de l’API:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('Aucune réponse reçue :', error.request);
        } else {
            console.error('Erreur inconnue:', error.message);
        }
        throw error;
    }
}

async downloadContractFile(contractId: string): Promise<Blob> {
  try {
    console.log(`Envoi de la requête pour télécharger le fichier du contrat avec l'ID : ${contractId}...`);
    const response = await axios.get(`${this.apiUrl}/download/${contractId}`, {
      ...this.getAuthHeaders(),
      responseType: 'blob', // Important pour recevoir un fichier
    });

    console.log(`Fichier du contrat avec l'ID ${contractId} récupéré avec succès.`);
    return response.data; // Retourner le fichier Blob
  } catch (error) {
    console.error(`Erreur lors de la récupération du fichier pour le contrat avec l'ID ${contractId}:`, error);
    throw error; // 'erreur pour qu'elle soit gérée dans le composant
  }
}

}
