import axios from 'axios';

export class AuthService {
  apiUrl = 'http://localhost:8081/auth';

  async signUp(userData: any) {
    const response = await axios.post(`${this.apiUrl}/signup`, userData);
    return response.data;
  }

  async signIn(credentials: any) {
    const response = await axios.post(`${this.apiUrl}/login`, credentials);
    return response.data;
  }
}
