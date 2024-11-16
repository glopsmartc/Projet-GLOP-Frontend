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
  
  async createContract(request: any): Promise<any> { 
    try {
      console.log('Envoi de la requête de création de contrat:', request); // Log de la requête
      const response = await axios.post(`${this.apiUrl}/create`, request, this.getAuthHeaders());
      console.log('Réponse de la création du contrat:', response); // Log de la réponse
      return response.data;
    } catch (error: unknown) {
      console.error('Erreur lors de la création du contrat:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        // Vérification si l'erreur provient d'Axios avec une réponse
        console.error('Détails de l\'erreur:', error.response.data);
      } else if (error instanceof Error) {
        // Si l'erreur est une instance de Error standard
        console.error('Message d\'erreur:', error.message);
      } else {
        // Autres types d'erreurs
        console.error('Erreur inattendue:', error);
      }
  
      throw error; // Relancer l'erreur pour la gestion dans le composant
    }
  }  

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

  
  
}  