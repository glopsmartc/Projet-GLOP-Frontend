import axios from 'axios';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/auth'; // tobeAdjusted if needed

  async signUp(userData: any) {
    return await axios.post(`${this.apiUrl}/signup`, userData);
  }

  async signIn(credentials: any) {
    return await axios.post(`${this.apiUrl}/login`, credentials);
  }
}
