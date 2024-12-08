import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';
import { ForgotPassService } from '../../services/forgot-pass.service';

@Component({
  selector: 'app-forgot-pass',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.css']
})
export class ForgotPassComponent {
  forgotPasswordForm: FormGroup;
  emailSent: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;  // Variable pour gérer l'état de chargement
  message: string = '';

  constructor(private formBuilder: FormBuilder, private forgotPassService: ForgotPassService) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      this.isLoading = true;  // Mettre isLoading à true quand le formulaire est soumis
      this.message = '';

      this.forgotPassService.forgotPassword(email).subscribe({
        next: (response) => {
          console.log(response);
          this.emailSent = true;
          this.message = 'L\'email de réinitialisation a été envoyé avec succès.';  // Message de succès
          this.isLoading = false;  // Réinitialiser isLoading à false après la réponse
        },
        error: (error) => {
          this.errorMessage = 'Échec de l\'envoi de l\'e-mail de réinitialisation. Veuillez réessayer.';
          this.message = this.errorMessage;
          console.error('L\'erreur est :', error);
          this.isLoading = false;  // Réinitialiser isLoading à false en cas d'erreur
        }
      });
    }
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }
}
