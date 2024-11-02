import axios from 'axios';

declare var config: any; 

export class AuthService {
  apiUrl = `${config.apiBaseUrl}/auth`;

  async signUp(userData: any) {
    const response = await axios.post(`${this.apiUrl}/signup`, userData);
    return response.data;
  }

  async signIn(credentials: any) {
    const response = await axios.post(`${this.apiUrl}/login`, credentials);
    return response.data;
  }
}
