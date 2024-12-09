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

  constructor(private formBuilder: FormBuilder, private forgotPassService: ForgotPassService) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      this.forgotPassService.forgotPassword(email).subscribe({
        next: (response) => {
          console.log(response);
          this.emailSent = true;
        },
        error: (error) => {
          this.errorMessage = 'Failed to send reset email. Please try again.';
          console.error('the Error is :', error);
        }
      });
    }
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }
}