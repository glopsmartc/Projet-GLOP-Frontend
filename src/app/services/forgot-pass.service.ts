import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class ForgotPassService {
  private apiUrl = `${window.config.apiBaseUrl}/auth`;

  constructor(private http: HttpClient) {}

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
