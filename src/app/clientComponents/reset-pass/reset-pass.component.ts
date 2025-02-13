import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';
import { ForgotPassService } from '../../services/forgot-pass.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-reset-pass',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './reset-pass.component.html',
  styleUrl: './reset-pass.component.css'
})
export class ResetPassComponent {
  resetPasswordForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  token: string = '';
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private forgotPassService: ForgotPassService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.formBuilder.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: this.passwordsMatchValidator }
    );

    // Récupérer le token depuis les paramètres de l'URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return newPassword === confirmPassword ? null : { passwordsMismatch: true };
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.value.newPassword;
  
      this.isLoading = true;
      console.log('isLoading is true:', this.isLoading);
  
      this.forgotPassService.resetPassword(this.token, newPassword).subscribe({
        next: (response) => {
          this.successMessage = 'Votre mot de passe a été réinitialisé avec succès.';
          this.errorMessage = '';
          this.isLoading = false;
          console.log('isLoading is false:', this.isLoading);
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.';
          this.isLoading = false;
          console.error(error);
        }
      });
    }
  }
  
  get newPassword() {
    return this.resetPasswordForm.get('newPassword');
  }

  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword');
  }

  get passwordsMismatch() {
    return this.resetPasswordForm.errors?.['passwordsMismatch'] && this.resetPasswordForm.touched;
  }
}
