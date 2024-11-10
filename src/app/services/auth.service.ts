import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import axios from 'axios';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/auth`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isTokenValid(this.getToken()));
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.isAuthenticatedSubject.next(this.isTokenValid(this.getToken()));
  }

  async signIn(credentials: any): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/login`, credentials);
      if (response.data.token) {
        this.storeToken(response.data.token);
        this.isAuthenticatedSubject.next(true); 
      }
      return response.data;
    } catch (error) {
      console.error('Sign-in error:', error);
      throw error; 
    }
  }

  private storeToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
    }
  }

  public isAuthenticated(): boolean {
    return this.isTokenValid(this.getToken());
  }

  private getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('token');
    }
    return null; 
  }

  private isTokenValid(token: string | null): boolean {
    if (!token) {
      return false;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime; 
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  public logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      this.isAuthenticatedSubject.next(false); 
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}
