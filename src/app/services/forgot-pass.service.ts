import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class ForgotPassService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = this.getApiUrl(); // Safely get the apiUrl
  }

  // Safe method to get the apiUrl, ensuring window is defined
  private getApiUrl(): string {
    if (typeof window !== 'undefined' && window.config) {
      return `${window.config.apiBaseUrl}/auth`;
    } else {
      console.warn('window.config is not available or window is undefined');
      return ''; 
    }
  }

  forgotPassword(email: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/reset-password`, {
      token,
      newPassword
    });
  }  
}
