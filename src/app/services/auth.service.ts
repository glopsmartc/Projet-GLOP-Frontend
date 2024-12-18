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
  private roles: string[] = [];

  constructor() {
    this.isAuthenticatedSubject.next(this.isTokenValid(this.getToken()));
    this.extractRoles();
  }
  public extractRoles(): void {
    const token = this.getToken(); if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.roles = payload.roles || [];
      } catch (error) {
        console.error('Token parsing error:', error);
        this.roles = [];
      }
    }
  }

  public hasRole(expectedRoles: string[]): boolean {
    return expectedRoles.some(role => this.roles.includes(role));
  }

  public logRole(): void {
    if (this.roles.includes('CONSEILLER')) {
      console.log('Logged in as CONSEILLER');
    } else {
      console.log('User role:', this.roles);
    }
  }

  async signIn(credentials: any): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/login`, credentials);
      if (response.data.token) {
        this.storeToken(response.data.token);
        this.isAuthenticatedSubject.next(true);
        this.extractRoles(); // extract roles after sign-in
        this.logRole(); // log the role
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

  public getToken(): string | null {
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
      this.roles = [];
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}
