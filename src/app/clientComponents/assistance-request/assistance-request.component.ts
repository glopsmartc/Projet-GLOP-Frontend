import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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

  isLocating: boolean = false;
  geoError: string = '';
  locationConfirmed: boolean = false;

  constructor(private readonly http: HttpClient) {}

  async onLocationCheckboxChange(event: any) {
    if (event.target.checked) {
      await this.getUserLocation();
    } else {
      this.location = '';
      this.locationConfirmed = false;
    }
  }

  // Get user's geolocation
  private async getUserLocation() {
    this.isLocating = true;
    this.geoError = '';

    try {
      const position = await this.getCurrentPosition();
      const address = await this.reverseGeocode(position.coords.latitude, position.coords.longitude);

      this.location = address;
      this.locationConfirmed = true;
    } catch (error) {
      this.geoError = this.getErrorMessage(error);
      this.location = '';
    } finally {
      this.isLocating = false;
    }
  }

  // Wrap geolocation in a promise
  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('La géolocalisation n’est pas supportée par votre navigateur'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(new Error(error.message)),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  // Reverse geocoding using OpenStreetMap Nominatim
  private async reverseGeocode(lat: number, lon: number): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    try {
      const response: any = await firstValueFrom(this.http.get(url));
      return response.display_name || 'Position actuelle (coordonnées non converties)';
    } catch (error) {
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  }

  // Error handling
  private getErrorMessage(error: any): string {
    switch (error.code || error) {
      case error.PERMISSION_DENIED:
        return 'Permission refusée - activez la géolocalisation dans vos paramètres';
      case error.POSITION_UNAVAILABLE:
        return 'Position indisponible';
      case error.TIMEOUT:
        return 'Délai de localisation dépassé';
      case 'La géolocalisation n’est pas supportée par votre navigateur':
        return 'Votre navigateur ne supporte pas la géolocalisation';
      default:
        return 'Erreur lors de la récupération de la position';
    }
  }




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
