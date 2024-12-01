import { Injectable } from '@angular/core';
import axios from 'axios';
import { AuthService } from './auth.service'; // Importer AuthService pour accéder au token

declare var config: any; 

@Injectable({
  providedIn: 'root',
})
export class ContratService {
  apiUrl = `${config.apiBaseUrlContrat}/api/contrat`; 

  constructor(private authService: AuthService) {} // Injection d'AuthService

  private getAuthHeaders() {
    const token = this.authService.getToken(); // Retrieve the token from AuthService
    console.log('Token utilisé pour l\'authentification:', token); // Log the token
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
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
          ...this.getAuthHeaders().headers, // Use Authorization header from getAuthHeaders()
          // Let FormData handle Content-Type
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
}
