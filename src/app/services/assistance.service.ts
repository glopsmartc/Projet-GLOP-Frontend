import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';
import { AuthService } from './auth.service';

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class AssistanceService {

  private readonly apiUrl: string;
  constructor(private readonly authService: AuthService, private readonly http: HttpClient) {
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
        'Authorization': `Bearer ${token}`,
      },
    };
  }

  async getAllRequests(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/allDossiersClient`, this.getAuthHeaders());
      console.log('Données récupérées depuis le backend allDossiersClient:', response.data);
      return response.data; // Retourne la liste des dossiers
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      throw error;
    }
  }

  async getAllRequests_Conseiller_Logisticien(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/allDossiers`, this.getAuthHeaders());
      console.log('Données récupérées depuis le backend allDossiers:', response.data);
      return response.data; // Retourne la liste des dossiers
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes pour Conseiller_Logisticien :', error);
      throw error;
    }
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
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la demande ou de l\'upload du fichier :', error);
      throw error;
    }
  }

  async getDocumentsForRequest(dossierId: number): Promise<any[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/dossier/${dossierId}`, this.getAuthHeaders());
      console.log('Documents récupérés pour le dossier:', dossierId, response.data);
      return response.data; // Retourne la liste des documents liés à la demande
    } catch (error) {
      console.error("Erreur lors de la récupération des documents:", error);
      return [];
    }
  }

  async assignPartenaireToRequest(partenaireId: number, requestId: number): Promise<any> {
    try {
      const response = await axios.put(`${this.apiUrl}/assigner/${partenaireId}/dossier/${requestId}`, {}, this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'assignation du partenaire:', error);
      throw error;
    }
  }

  async removePartenaireFromDossier(requestId: number): Promise<any> {
    try {
      const response = await axios.put(`${this.apiUrl}/removePartenaire/dossier/${requestId}`, {}, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression du partenaire:', error);
      throw error;
    }
  }
  async updateStatut(requestId: number, newStatut: string): Promise<any> {
    try {
      const response = await axios.patch(
        `${this.apiUrl}/updateStatut/${requestId}`,
        null,
        {
          ...this.getAuthHeaders(),
          params: { statut: newStatut }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  }

  async downloadDocument(filePath: string): Promise<Blob> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/getFile?filePath=${encodeURIComponent(filePath)}`,
        {
          ...this.getAuthHeaders(),
          responseType: 'blob',
        }
      );
      console.log('endpoint', `${this.apiUrl}/getFile?filePath=${encodeURIComponent(filePath)}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier :', error);
      throw error;
    }
  }

  async getAllRequests_Partenaire(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/allDossiersPartenaire`, this.getAuthHeaders());
      console.log('Données récupérées depuis le backend:', response.data);
      return response.data; // Retourne la liste des dossiers
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes pour Conseiller_Logisticien :', error);
      throw error;
    }
  }


  //partie partenaire dans demande assistance :
  //actions réalisées
  async deleteAction(idDossier: number, action: string): Promise<any> {
    // Encoder l'action complète (nom,cout)
    const encodedAction = encodeURIComponent(action);

    return this.http.delete(
      `${this.apiUrl}/dossier/${idDossier}/action`,
      {
        params: { action: encodedAction },
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders().headers
        }
      }
    ).toPromise();
  }
  /*async getActions(idDossier: number) {
    return this.http.get<string[]>(`/api/dossier/${idDossier}/actions`).toPromise();
  }*/
    async saveActions(
      dossierId: number,
      actions: { name: string; cost: number }[],
      totalCost: number
    ): Promise<any> {
      try {
        const response = await axios.post(
          `${this.apiUrl}/dossier/${dossierId}/action`,
          {
            actions: actions.map(a => ({
              name: a.name,
              cost: a.cost
            })),
            totalCost: totalCost
          },

            {
              headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeaders().headers
              }
            }

        );
        return response.data;
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des actions:', error);
        throw error;
      }
    }


  //Factures:
  /*async getFactures(idDossier: number) {
    return this.http.get<string[]>(`/api/dossier/${idDossier}/factures`).toPromise();
  }*/
    async uploadFactures(dossierId: number, factureFiles: File[]): Promise<any> {
      try {
        const formData = new FormData();
        factureFiles.forEach(file => {
          formData.append('factureFiles', file); // kima @RequestParam("factureFiles")
        });

        const response = await axios.put(
          `${this.apiUrl}/addFactures/${dossierId}`,
          formData,
          {
            headers: {
              ...this.getAuthHeaders().headers,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error('Erreur lors de l\'upload des factures:', error);
        throw error;
      }
    }
}
