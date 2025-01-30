import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assistance-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assistance-request.component.html',
  styleUrl: './assistance-request.component.css',
})
export class AssistanceRequestComponent {
  step: number = 1;
  assistanceType: string = '';
  urgency: string = '';
  location: string = '';
  useCurrentLocation: boolean = false;
  description: string = '';
  otherDescription: string = '';
  phone: string = '';
  email: string = '';
  submitted: boolean = false;
  pdfFile: File | null = null;

  emptyFieldError: boolean = false;

  errorMessage: string = 'Veuillez remplir tous les champs du formulaire.';

  nextStep() {
    if (this.validateStep()) {
      this.emptyFieldError = false;
      if (this.step < 4) {
        this.step++;
      }
    } else {
      this.emptyFieldError = true;
    }
  }

  previousStep() {
    if (this.step > 1) this.step--;
  }

  validateAndSubmit() {
    if (this.validateStep()) {
      this.emptyFieldError = false;
      this.submitRequest();
    } else {
      this.emptyFieldError = true;
    }
  }

  submitRequest() {
    const requestData = {
      assistanceType: this.assistanceType,
      urgency: this.urgency,
      location: this.location,
      description: this.description,
      phone: this.phone,
      email: this.email,
      otherDescription:
        this.assistanceType === 'Autre' ? this.otherDescription : null,
      pdfFile: this.pdfFile,
    };
    console.log('Request Submitted:', requestData);
    this.submitted = true;
    this.step++;
  }

  goHome() {
    this.step = 1;
    this.submitted = false;
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.pdfFile = file;
      console.log('File Uploaded:', file);
    } else {
      console.log('Please upload a valid PDF file.');
    }
  }

  validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  validateStep(): boolean {
    switch (this.step) {
      case 1:
        return (
          !!this.assistanceType &&
          !!this.urgency &&
          (this.assistanceType !== 'Autre' || !!this.otherDescription)
        );
      case 2:
        return !!this.location;
      case 3:
        return !!this.description && !!this.pdfFile;
      case 4:
        if (!this.phone) {
          this.errorMessage = 'Veuillez entrer un numéro de téléphone.';
          return false;
        }
        if (!this.email || !this.validateEmail(this.email)) {
          this.errorMessage = 'Veuillez entrer une adresse email valide.';
          return false;
        }
        return true;
      default:
        return false;
    }
  }
}
