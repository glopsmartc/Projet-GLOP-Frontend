import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPageComponent } from './login-page.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { routes } from '../../app.routes';
import axios from 'axios';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let router: Router;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent, FormsModule, CommonModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: { extractRoles: () => {}, logRole: () => {}, hasRole: () => {} } },
        provideRouter(routes, withComponentInputBinding())
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle signUp and signIn classes', () => {
    const container = { nativeElement: { classList: { add: jasmine.createSpy('add'), remove: jasmine.createSpy('remove') } } };
    component.container = container as any;

    component.signUp();
    expect(container.nativeElement.classList.add).toHaveBeenCalledWith('right-panel-active');

    component.signIn();
    expect(container.nativeElement.classList.remove).toHaveBeenCalledWith('right-panel-active');
  });

  it('should handle signUp with invalid form', async () => {
    const signupForm = { invalid: true };
    await component.onSignUp(signupForm);
    expect(component.requiredMessage).toBe('Complétez tous les champs obligatoires.');
  });

  it('should handle signUp with invalid phone number', async () => {
    const signupForm = { invalid: false };
    component.phoneNumber = '123456789';
    await component.onSignUp(signupForm);
    expect(component.phoneNumberInvalid).toBeTrue();
  });

  it('should handle successful signUp', async () => {
    const signupForm = { invalid: false };
    component.lastName = 'Doe';
    component.firstName = 'John';
    component.emailSignUp = 'john.doe@example.com';
    component.address = '123 Main St';
    component.phoneNumber = '+33123456789';
    component.passwordSignUp = 'password';
    component.confirmPassword = 'password';
    component.sexe = 'male';

    spyOn(axios, 'post').and.returnValue(Promise.resolve({ data: {} }));
    spyOn(component, 'signIn');

    await component.onSignUp(signupForm);
    expect(axios.post).toHaveBeenCalledWith(`${component.authApiUrl}/signup`, {
      nom: 'Doe',
      prenom: 'John',
      email: 'john.doe@example.com',
      adresse: '123 Main St',
      numTel: '+33123456789',
      password: 'password',
      sexe: 'male'
    });
    expect(component.signIn).toHaveBeenCalled();
  });

});
