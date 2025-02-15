import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LocationService } from '../../services/location.service';
import { ContratService } from '../../services/contrat.service'; // Import ContratService
import { AssistanceService } from '../../services/assistance.service';

@Component({
  selector: 'app-assistance-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assistance-request.component.html',
  styleUrl: './assistance-request.component.css',
})
export class AssistanceRequestComponent {
  step: number = 0;
  assistanceType: string = '';
  maladieChronique: boolean = false;
  descriptionMaladie: string = '';
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
  contractErrorMsg: string = '';

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

  contracts: any[] = [];
  activeContracts: any[] = [];
  selectedContract: any = null;
  services: string[] = [];

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly locationService: LocationService,
    private readonly contratService: ContratService,
    private readonly assistanceService: AssistanceService,
  ) { }

  async ngOnInit() {
    await this.loadContracts();
  }

  hasActiveContracts(): boolean {
    return this.contracts.some(contract => contract.statut === 'actif');
  }

  async loadContracts() {
    try {
      this.contracts = await this.contratService.getUserContracts();
      console.log('Contracts loaded:', this.contracts);

      this.activeContracts = this.contracts.filter(contract => contract.statut === 'actif');
      if (this.activeContracts.length === 0) {
        this.contractErrorMsg = 'Vous n’avez aucun contrat actif. Veuillez souscrire à un contrat pour demander une assistance.';
        this.emptyFieldError = false;
      } else {
        this.contractErrorMsg = '';
        this.emptyFieldError = false;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des contrats:', error);
      this.contractErrorMsg = 'Vous n’avez aucun contrat actif. Veuillez souscrire à un contrat pour demander une assistance.';
      this.emptyFieldError = false;
    }
  }

  async onContractSelect(contractId: number) {
    try {
      this.selectedContract = this.contracts.find(contract => contract.id === contractId);
      if (this.selectedContract && this.selectedContract.statut !== 'actif') {
        this.contractErrorMsg = 'Ce contrat n’est pas actif. Veuillez sélectionner un contrat actif.';
        this.selectedContract = null;
        return;
      }
      if (this.selectedContract) {
        const servicesString = await this.contratService.getContractServices(contractId);
        if (Array.isArray(servicesString) && servicesString.length > 0) {
          const cleanString = servicesString[0].replace(/\\n/g, '\n');
          this.services = cleanString.split('\n');
          this.contractErrorMsg = '';
        } else {
          this.services = [];
          console.error('Invalid services string format');
        }
        console.log('Services array:', this.services);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection du contrat:', error);
      this.contractErrorMsg = 'Erreur lors de la récupération des services du contrat. Veuillez réessayer plus tard.';
      this.emptyFieldError = true;
    }
  }




  async getLocation() {
    this.isLocating = true;
    this.locationError = '';
  
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simule un délai de chargement
      const result = await this.locationService.getCurrentLocation();
      this.location = result.address;
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.locationError = 'La localisation a été refusée. Veuillez autoriser l’accès à votre position.';
            break;
          case error.POSITION_UNAVAILABLE:
            this.locationError = 'La localisation est indisponible. Veuillez vérifier votre connexion.';
            break;
          case error.TIMEOUT:
            this.locationError = 'Le délai de localisation a expiré. Veuillez réessayer.';
            break;
          default:
            this.locationError = 'Erreur de localisation inconnue.';
        }
      } else {
        this.locationError = 'Erreur de localisation. Veuillez réessayer.';
      }
    } finally {
      this.isLocating = false;
    }
  }

  nextStep() {
  if (this.step === 0 && !this.selectedContract) {
    this.errorMessage = 'Veuillez sélectionner un contrat pour continuer.';
    this.emptyFieldError = true;
    return;
  }
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
    if (this.step > 0) this.step--;
    this.contractErrorMsg = '';
    this.emptyFieldError = false;
  }

  validateAndSubmit() {
    if (this.validateStep()) {
      this.emptyFieldError = false;
      this.submitRequestWithFiles();
    } else {
      this.emptyFieldError = true;
    }
  }
  

  submitRequestWithFiles() {
    const formData = new FormData();
  
    this.pdfFiles.forEach((pdf) => {
      formData.append('pdfFiles', pdf.file, pdf.name);
    });
  
    this.imageFiles.forEach((image) => {
      formData.append('imageFiles', image.file, image.name);
    });
  
    const dossierData = {
      description: this.description,
      type: this.assistanceType,
      idContrat: this.selectedContract?.id,
      maladieChronique: this.maladieChronique,
      descriptionMaladie: this.descriptionMaladie,
      positionActuelle: this.location || this.manualLocation,
      priorite: this.urgency,
      numTel: this.phone,
      email: this.email,
    };
  
    formData.append(
      'dossierData',
      new Blob([JSON.stringify(dossierData)], { type: 'application/json' })
    );
  
    this.assistanceService
      .submitDossierWithFiles(formData)
      .then((response) => console.log('Dossier soumis avec succès avec fichiers:', response))
      .catch((error) =>
        console.error('Erreur lors de la soumission avec fichiers :', error)
      );
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
      } else {
        alert(`Le fichier ${file.name} n'est pas un PDF ou une image valide.`);
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
      case 0:
        if (!this.selectedContract) {
          this.errorMessage = 'Veuillez sélectionner un contrat pour continuer.';
          return false;
        }
        return true;
      case 1:
        if (!this.assistanceType || !this.urgency || !this.description) {
          this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
          return false;
        }
        if (this.assistanceType === 'Autre' && !this.otherType) {
          this.errorMessage = 'Veuillez spécifier le type d’assistance.';
          return false;
        }
        if (this.maladieChronique && !this.descriptionMaladie) {
          this.errorMessage = 'Veuillez décrire vos maladies chroniques.';
          return false;
        }
        return true;
      case 2:
        if (!this.location && !this.manualLocation) {
          this.errorMessage = 'Veuillez fournir une localisation.';
          return false;
        }
        return true;
      case 3:
        if (!this.phone) {
          this.errorMessage = 'Veuillez entrer un numéro de téléphone valide.';
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
