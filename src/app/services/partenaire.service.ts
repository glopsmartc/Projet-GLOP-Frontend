import { Injectable } from '@angular/core';
import axios from 'axios';
import { AuthService } from './auth.service';

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class PartenaireService {
  private apiUrl: string;

  constructor(private authService: AuthService) {
       this.apiUrl = this.getApiUrl();
  }

  private getApiUrl(): string {
    if (typeof window !== 'undefined' && window?.config?.apiBaseUrlAssistance) {
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
      Authorization: `Bearer ${token}`,
    };
  }

  async getAllPartenaires(): Promise<any[]> {
    try {
      const response = await axios.get(this.apiUrl, { headers: this.getAuthHeaders() });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des partenaires:', error);
      throw error;
    }
  }

  async deletePartenaire(id: number): Promise<void> {
    try {
      await axios.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    } catch (error) {
      console.error('Erreur lors de la suppression du partenaire:', error);
      throw error;
    }
  }

  async updatePartenaire(id: number, partenaireData: any): Promise<void> {
    try {
      await axios.put(`${this.apiUrl}/${id}`, partenaireData, { headers: this.getAuthHeaders() });
    } catch (error) {
      console.error('Erreur lors de la modification du partenaire:', error);
      throw error;
    }
  }

  async addPartenaire(partenaireData: any): Promise<void> {
    try {
      await axios.post(this.apiUrl, partenaireData, { headers: this.getAuthHeaders() });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du partenaire:', error);
      throw error;
    }
  }
}
