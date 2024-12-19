import { Injectable } from '@angular/core';
import axios from 'axios';
import { AuthService } from './auth.service'; // Importer AuthService pour accéder au token
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root',
})
export class ContratService {
  apiUrl = `${environment.apiBaseUrlContrat}/api/contrat`; 

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

   // Méthode pour récupérer les contrats de l'utilisateur connecté
   async getUserContracts(): Promise<any> {  
    try {
      console.log('Envoi de la requête pour récupérer les contrats de l\'utilisateur (GET):');
      const response = await axios.get(`${this.apiUrl}/user-contracts`, this.getAuthHeaders()); // Appel de l'API pour récupérer les contrats
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
  
}
