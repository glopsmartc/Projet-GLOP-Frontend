import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import axios, { AxiosError } from 'axios';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  maxDate: string = new Date().toISOString().split('T')[0];
  loginErrorMessage: string | null = null;
  passwordMismatch: boolean = false;
  phoneNumberInvalid: boolean = false;
  requiredMessage: string = '';
  validEmailMessage: string = '';

  @ViewChild('container', { static: false }) container!: ElementRef;

  lastName: string = '';
  firstName: string = '';
  emailSignUp: string = '';
  address: string = '';
  phoneNumber: string = '';
  sexe: string = '';
  passwordSignUp: string = '';
  confirmPassword: string = '';
  emailSignIn: string = '';
  passwordSignIn: string = '';

  apiBaseUrl: string = '';

  constructor(private router: Router, private authService: AuthService) {
    axios.defaults.headers.common['Content-Type'] = 'application/json';
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.apiBaseUrl = (window as any).config?.apiBaseUrl || 'http://localhost:8081'; // Fallback to localhost if not set
    } else {
      this.apiBaseUrl = 'http://localhost:8081';
    }
    console.log('API Base URL in component:', this.apiBaseUrl);
  }

  get authApiUrl(): string {
    return `${this.apiBaseUrl}/auth`;
  }

  signUp() {
    this.container.nativeElement.classList.add("right-panel-active");
  }

  signIn() {
    this.container.nativeElement.classList.remove("right-panel-active");
  }

  async onSignUp(signupForm: any) {
    this.passwordMismatch = false;
    this.phoneNumberInvalid = false;
    this.requiredMessage = '';
    this.validEmailMessage = '';

    if (signupForm.invalid) {
      this.requiredMessage = 'Complétez tous les champs obligatoires.';
      return;
    }

    const phoneNumberRegex = /^\+33\d{9}$/;
    if (!phoneNumberRegex.test(this.phoneNumber)) {
      this.phoneNumberInvalid = true;
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.emailSignUp)) {
      this.validEmailMessage = 'Please enter a valid email address.';
      return;
    }

    if (this.passwordSignUp !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

    const userData = {
      nom: this.lastName,
      prenom: this.firstName,
      email: this.emailSignUp,
      adresse: this.address,
      numTel: this.phoneNumber,
      password: this.passwordSignUp,
      sexe: this.sexe
    };

    try {
      const response = await axios.post(`${this.authApiUrl}/signup`, userData);
      console.log('Signup successful', response.data);
      this.signIn();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error during signup', axiosError);
      if (axiosError.response) {
        console.error('Server responded with:', axiosError.response.data);

        if (axiosError.response.status === 409) {
          this.requiredMessage = "Un utilisateur avec cette adresse e-mail existe déjà.";
        } else {
          this.requiredMessage = "L'inscription a échoué. Veuillez vérifier vos informations et réessayer.";
        }
      }
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
      this.authService.extractRoles(); // Extract roles
      this.authService.logRole(); // Log roles to console
      this.loginErrorMessage = null;

      // Navigate based on role
      if (this.authService.hasRole(['ROLE_CLIENT'])) {
        await this.router.navigate(['/calculate-emission']);
      } else if (this.authService.hasRole(['ROLE_CONSEILLER'])) {
        await this.router.navigate(['/clients-contracts']);
      } else if (this.authService.hasRole(['ROLE_LOGISTICIEN'])) {
        await this.router.navigate(['/assistance-requests-logis']);
      }
      else {
        // Default navigation or handle other roles
        await this.router.navigate(['/']);
      }

    // Reload the page after navigation
    window.location.reload();

    } catch (error: any) {
      console.error('Error during signin', error);
      this.loginErrorMessage = error.response?.data?.message || 'Échec de la connexion. Veuillez vérifier votre e-mail et votre mot de passe.';
    }
  }

}
