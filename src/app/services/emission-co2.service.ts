import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class EmissionCo2Service {
  private apiUrl: string;
  private carbonSutraUrl = 'https://carbonsutra1.p.rapidapi.com';
  private rapidApiKey = 'cf5b9a598dmsh7a26dccd9aad29bp191fdcjsn80318b275576';
  private rapidApiHost = 'carbonsutra1.p.rapidapi.com';

  constructor(private http: HttpClient, private authService: AuthService) {
    this.apiUrl = this.getApiUrl();
  }

  private getApiUrl(): string {
    if (typeof window !== 'undefined' && window.config?.apiBaseUrlContrat) {
      return `${window.config.apiBaseUrlContrat}/api/emissions`;
    } else {
      console.warn('window.config is not available or window is undefined');
      return '';
    }
  }

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'x-rapidapi-key': this.rapidApiKey,
      'x-rapidapi-host': this.rapidApiHost
    });
  }

  calculateEmissions(km: number, selectedTransport: number): Observable<any> {
    const params = new HttpParams()
      .set('km', km.toString())
      .set('transports', selectedTransport.toString());

    const headers = this.getAuthHeaders();

    return this.http.get<any>(this.apiUrl, { headers, params });
  }

  getVehicleMakes(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.carbonSutraUrl}/vehicle_makes`, { headers });
  }

  getVehicleModels(make: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.carbonSutraUrl}/vehicle_makes/${make}/vehicle_models`, { headers });
  }

  estimateVehicleEmissions(make: string, model: string, distance: number, unit: string = 'km'): Observable<any> {
    const headers = this.getAuthHeaders();
    const body = new HttpParams()
      .set('vehicle_make', make)
      .set('vehicle_model', model)
      .set('distance_value', distance.toString())
      .set('distance_unit', unit);

    return this.http.post<any>(`${this.carbonSutraUrl}/vehicle_estimate_by_model`, body, { headers });
  }
}
