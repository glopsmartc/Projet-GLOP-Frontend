import { Injectable } from '@angular/core';
import axios from 'axios';
import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class AssistanceService {
  //a coder
  async getAllRequests(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/allDossiersClient`, this.getAuthHeaders());
      console.log('Données récupérées depuis le backend:', response.data);
      return response.data; // Retourne la liste des dossiers
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      throw error; // Laissez l'erreur remonter pour être gérée dans le composant
    }
  }

   private apiUrl: string;

    constructor(private authService: AuthService) {
      this.apiUrl = this.getApiUrl();
    }

    private getApiUrl(): string {
      if (typeof window !== 'undefined' && window.config?.apiBaseUrlAssistance) {
        return `${window.config.apiBaseUrlAssistance}/api/assistance`;
      } else {
        console.warn('window.config is not available or window is undefined');
        return '';
      }
    }

    private getAuthHeaders() {
      const token = this.authService.getToken();
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }

    async submitDossierWithFiles(formData: FormData): Promise<any> {
      try {

          console.log('Envoi de la requête pour créer la demande assistance :', formData);

          // Call the API to create the contract
          const response = await axios.post(`${this.apiUrl}/create`, formData, {
            headers: {
              ...this.getAuthHeaders().headers,
              Accept: 'application/json',
            },
          });

          console.log('Réponse du backend (demande créé) :', response.data);
          return response.data; // Return the demande data
        } catch (error) {
          console.error('Erreur lors de la création de la demande ou de l\'upload du fichier :', error);
          throw error; // Re-throw the error for further handling
        }
      }

      async getDocumentsForRequest(dossierId: number): Promise<any[]> {
        try {
          const response = await axios.get(`${this.apiUrl}/dossierDocuments/${dossierId}`, this.getAuthHeaders());
          console.log('Documents récupérés pour le dossier:', dossierId, response.data);
          return response.data; // Retourne la liste des documents liés à la demande
        } catch (error) {
          console.error("Erreur lors de la récupération des documents:", error);
          return []; // Retourne un tableau vide en cas d'erreur
        }
      }

}
