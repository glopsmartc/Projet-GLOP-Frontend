import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotPassService {
  private baseUrl = 'http://localhost:8081/auth'; // Update if necessary

  constructor(private http: HttpClient) {}

  forgotPassword(email: string): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/forgot-password`, { email });
  }
}
