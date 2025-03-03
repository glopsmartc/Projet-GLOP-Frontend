import { Injectable } from '@angular/core';
import axios from 'axios';
import { AuthService } from './auth.service';

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class AssistanceService {
  //a coder
  getAllRequests(): any[] | PromiseLike<any[]> {
    throw new Error('Method not implemented.');
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
      console.log('Token utilisé pour l\'authentification:', token);
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
}
