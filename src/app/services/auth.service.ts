import axios from 'axios';
import { environment } from '../../environments/environment';

export class AuthService {
  apiUrl = `${environment.apiBaseUrl}/auth`;

  async signUp(userData: any) {
    const response = await axios.post(`${this.apiUrl}/signup`, userData);
    return response.data;
  }

  async signIn(credentials: any) {
    const response = await axios.post(`${this.apiUrl}/login`, credentials);
    return response.data;
  }
}
