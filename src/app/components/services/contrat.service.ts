import { Injectable } from '@angular/core';
import axios from 'axios';

declare var config: any; 
 
@Injectable({
  providedIn: 'root',
})


export class ContratService {
  apiUrl = `${config.apiBaseUrlContrat}/api/contrat`; 

  /*async createContract(request: any): Promise<any> { 
    try {
      const response = await axios.post(`${this.apiUrl}/create`, request);
      return response.data; // Retourne le contrat créé
    } catch (error) {
      console.error('Erreur lors de la création du contrat:', error);
      throw error; // Lance l'erreur pour la gérer dans le composant
    }
  }*/

  async getOffreCorrespondante(request: any): Promise<any> { 
    try {
      const response = await axios.post(`${this.apiUrl}/getOffre`, request);
      return response.data; // Retourne l'offre correspondante
    } catch (error) {
      console.error('Erreur lors de la récupération des offres:', error);
      throw error; // Lance l'erreur pour la gérer dans le composant
    }
  }
}