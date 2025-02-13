import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LocationService } from '../../services/location.service';

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
  medicalAssistance: string = '';
  medicalInfo: string = '';
  urgency: string = '';
  location: string = '';
  useCurrentLocation: boolean = false;
  description: string = '';
  otherType: string = '';
  phone: string = '';
  email: string = '';
  submitted: boolean = false;
  pdfFile: File | null = null;

  emptyFieldError: boolean = false;

  errorMessage: string = 'Veuillez remplir tous les champs du formulaire.';

  isLocating: boolean = false;
  geoError: string = '';
  locationConfirmed: boolean = false;

  manualLocation: string = '';
  locationError: string = '';

  pdfFiles: { file: File, name: string, preview: SafeResourceUrl }[] = [];   // Changed to SafeResourceUrl type
  imageFiles: { file: File, name: string, preview: string }[] = [];
  showPdf: boolean[] = [];  // Array to track visibility of each PDF
  showImage: boolean[] = [];  // Array to track visibility of each image

  MAX_FILE_SIZE = 5 * 1024 * 1024;

  constructor(private readonly http: HttpClient, private readonly sanitizer: DomSanitizer, private readonly locationService: LocationService) { }

  async getLocation() {
    this.isLocating = true;
    this.locationError = '';

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = await this.locationService.getCurrentLocation();
      this.location = result.address;
    } catch (error) {
      this.locationError = error instanceof Error ? error.message : 'Erreur de localisation';
    } finally {
      this.isLocating = false;
    }
  }


  nextStep() {
    if (this.validateStep()) {
      this.emptyFieldError = false;
      if (this.step < 3) {
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
      medicalAssistance: this.medicalAssistance,
      medicalInfo: this.medicalInfo,
      phone: this.phone,
      email: this.email,
      otherType: this.assistanceType === 'Autre' ? this.otherType : null,
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
    const files = event.target.files;

    for (const file of files) {
      if (file.size > this.MAX_FILE_SIZE) {
        alert(`Le fichier ${file.name} dépasse la taille limite de 5 Mo.`);
        continue;
      }

      if (file.type === 'application/pdf') {
        const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
        this.pdfFiles.push({
          file: file,
          name: file.name,
          preview: safeUrl
        });
        this.showPdf.push(false);
      } else if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageFiles.push({
            file: file,
            name: file.name,
            preview: e.target.result
          });
          this.showImage.push(false);
        };
        reader.readAsDataURL(file);
      }
    }
    console.log('Uploaded Files:', files);
  }

  togglePdfDisplay(index: number) {
    this.showPdf[index] = !this.showPdf[index];
  }

  toggleImageDisplay(index: number) {
    this.showImage[index] = !this.showImage[index];
  }

  removePdf(index: number) {
    console.log('Removing PDF at index:', index);
    this.pdfFiles.splice(index, 1);
    this.showPdf.splice(index, 1);
    console.log('Updated PDFs:', this.pdfFiles);
  }

  removeImage(index: number) {
    console.log('Removing image at index:', index);
    this.imageFiles.splice(index, 1);
    this.showImage.splice(index, 1);
    console.log('Updated images:', this.imageFiles);
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
          !!this.description &&
          (this.assistanceType !== 'Autre' || !!this.otherType) &&
          (this.assistanceType !== 'Autre' || !!this.medicalAssistance) &&
          (this.medicalAssistance !== 'Oui' || !!this.medicalInfo) &&
          (this.assistanceType !== 'Medicale' || !!this.medicalInfo)
        );
      case 2:
        return !!this.location;
      case 3:
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
