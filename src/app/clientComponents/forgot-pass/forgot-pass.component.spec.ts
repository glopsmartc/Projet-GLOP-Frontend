import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPassComponent } from './forgot-pass.component';
import { ForgotPassService } from '../../services/forgot-pass.service';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ForgotPassComponent', () => {
  let component: ForgotPassComponent;
  let fixture: ComponentFixture<ForgotPassComponent>;
  let forgotPassService: jasmine.SpyObj<ForgotPassService>;

  beforeEach(async () => {
    const forgotPassServiceSpy = jasmine.createSpyObj('ForgotPassService', ['forgotPassword']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, ForgotPassComponent],
      providers: [
        FormBuilder,
        { provide: ForgotPassService, useValue: forgotPassServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPassComponent);
    component = fixture.componentInstance;
    forgotPassService = TestBed.inject(ForgotPassService) as jasmine.SpyObj<ForgotPassService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with an empty email field', () => {
    expect(component.forgotPasswordForm.value).toEqual({ email: '' });
  });

  it('should call forgotPassword service on valid form submission', () => {
    const mockResponse = 'Email sent';
  forgotPassService.forgotPassword.and.returnValue(of(mockResponse));

    component.forgotPasswordForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    expect(forgotPassService.forgotPassword).toHaveBeenCalledWith('test@example.com');
    expect(component.emailSent).toBeTrue();
    expect(component.message).toBe('L\'email de réinitialisation a été envoyé avec succès.');
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error when forgotPassword service fails', () => {
    forgotPassService.forgotPassword.and.returnValue(throwError(() => new Error('Error occurred')));

    component.forgotPasswordForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    expect(component.errorMessage).toBe('Échec de l\'envoi de l\'e-mail de réinitialisation. Veuillez réessayer.');
    expect(component.isLoading).toBeFalse();
  });

  it('should not submit if the form is invalid', () => {
    component.forgotPasswordForm.setValue({ email: '' });
    component.onSubmit();

    expect(forgotPassService.forgotPassword).not.toHaveBeenCalled();
  });
});
