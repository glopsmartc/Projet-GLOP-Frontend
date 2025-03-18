import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPassComponent } from './reset-pass.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ForgotPassService } from '../../services/forgot-pass.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ResetPassComponent', () => {
  let component: ResetPassComponent;
  let fixture: ComponentFixture<ResetPassComponent>;
  let forgotPassService: jasmine.SpyObj<ForgotPassService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const forgotPassServiceSpy = jasmine.createSpyObj('ForgotPassService', ['resetPassword']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ResetPassComponent],
      providers: [
        FormBuilder,
        { provide: ForgotPassService, useValue: forgotPassServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({ token: 'test-token' }) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPassComponent);
    component = fixture.componentInstance;
    forgotPassService = TestBed.inject(ForgotPassService) as jasmine.SpyObj<ForgotPassService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.resetPasswordForm.value).toEqual({
      newPassword: '',
      confirmPassword: ''
    });
  });

  it('should require a new password with at least 6 characters', () => {
    const newPasswordControl = component.newPassword;
    newPasswordControl?.setValue('123');
    expect(newPasswordControl?.invalid).toBeTrue();

    newPasswordControl?.setValue('123456');
    expect(newPasswordControl?.valid).toBeTrue();
  });

  it('should validate that passwords match', () => {
    component.newPassword?.setValue('password123');
    component.confirmPassword?.setValue('password456');
    expect(component.resetPasswordForm.errors?.['passwordsMismatch']).toBeTrue();

    component.confirmPassword?.setValue('password123');
    expect(component.resetPasswordForm.errors?.['passwordsMismatch']).toBeFalsy();
  });


  it('should set error message on failed password reset', () => {
    forgotPassService.resetPassword.and.returnValue(throwError(() => new Error('Reset failed')));

    component.newPassword?.setValue('newpassword123');
    component.confirmPassword?.setValue('newpassword123');
    component.onSubmit();

    expect(component.errorMessage).toBe('Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.');
    expect(component.successMessage).toBe('');
  });

});
