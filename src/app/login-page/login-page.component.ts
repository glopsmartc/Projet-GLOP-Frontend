import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import axios, { AxiosError } from 'axios';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  @ViewChild('container', { static: false }) container!: ElementRef;

  lastName: string = '';
  firstName: string = '';
  emailSignUp: string = '';
  address: string = '';
  phoneNumber: string = '';
  birthDate: string = '';
  passwordSignUp: string = '';
  confirmPassword: string = '';
  emailSignIn: string = '';
  passwordSignIn: string = '';

  apiBaseUrl: string = environment.apiBaseUrl;

  constructor() {
    axios.defaults.headers.common['Content-Type'] = 'application/json';
  }

  ngOnInit(): void { }

  get authApiUrl(): string {
    return `${this.apiBaseUrl}/auth`; 
  }

  signUp() {
    this.container.nativeElement.classList.add("right-panel-active");
  }

  signIn() {
    this.container.nativeElement.classList.remove("right-panel-active");
  }

  async onSignUp() {
    if (this.passwordSignUp !== this.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const userData = {
      nom: this.lastName,
      prenom: this.firstName,
      email: this.emailSignUp,
      adresse: this.address,
      numTel: this.phoneNumber,
      password: this.passwordSignUp,
      dateNaissance: this.birthDate
    };

    try {
      const response = await axios.post(`${this.authApiUrl}/signup`, userData);
      console.log('Signup successful', response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error during signup', axiosError);
      if (axiosError.response) {
        console.error('Server responded with:', axiosError.response.data);
      }
      alert('Signup failed. Please check your input and try again.');
    }
  }

  async onSignIn() {
    const credentials = {
      email: this.emailSignIn,
      password: this.passwordSignIn
    };

    try {
      const response = await axios.post(`${this.authApiUrl}/login`, credentials);
      console.log('Signin successful', response.data);
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    } catch (error: any) {
      console.error('Error during signin', error);
      alert(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  }
}
