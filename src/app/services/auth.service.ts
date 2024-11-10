import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  apiUrl = `${environment.apiBaseUrl}/auth`;

  async signIn(credentials: any) {
    const response = await axios.post(`${this.apiUrl}/login`, credentials);
    if (response.data.token) {
      this.storeToken(response.data.token);
    }

    return response.data;
  }

  private storeToken(token: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? this.isTokenValid(token) : false;
  }

  private getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
}