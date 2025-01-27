import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service'; 

declare const window: any;

@Injectable({
  providedIn: 'root'
})

export class EmissionCo2Service {
  private apiUrl: string;


  constructor(private http: HttpClient, private authService: AuthService) {
    this.apiUrl = this.getApiUrl();
   }


  private getApiUrl(): string {
    if (typeof window !== 'undefined' && window.config && window.config.apiBaseUrlContrat) {
      return `${window.config.apiBaseUrlContrat}/api/emissions`;
    } else {
      console.warn('window.config is not available or window is undefined');
      return '';
    }
  }

  private getAuthHeaders() {
    const token = this.authService.getToken();  
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  calculateEmissions(km: number, selectedTransport: number) {
    const params = new HttpParams()
      .set('km', km.toString())
      .set('transports', selectedTransport.toString());

    const headers = this.getAuthHeaders();

    return this.http.get<any>(this.apiUrl, { headers, params });
  }
}
