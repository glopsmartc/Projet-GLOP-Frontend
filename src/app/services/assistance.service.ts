import { Injectable } from '@angular/core';
import axios from 'axios';
import { AuthService } from './auth.service';

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class AssistanceService {

   private apiUrl: string;
  
    constructor(private authService: AuthService) {
      this.apiUrl = this.getApiUrl();
    }
  
    private getApiUrl(): string {
      if (typeof window !== 'undefined' && window.config && window.config.apiBaseUrlAssistance) {
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
  
}
