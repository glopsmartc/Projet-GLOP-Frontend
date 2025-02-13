import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as jsPDF from 'jspdf';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PaymentDialogComponent } from '../../modalDialogs/payment-dialog/payment-dialog.component'; 
import { ContratService } from '../../services/contrat.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReforestationDialogComponent } from '../../modalDialogs/reforestation-dialog/reforestation-dialog.component'; 

@Component({
  selector: 'app-sign-contract',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './sign-contract.component.html',
  styleUrls: ['./sign-contract.component.css'],
})
export class SignContractComponent implements OnInit {
  formData: any;
  selectedPlan: any;
  acceptTerms: boolean = false;
  currentUserName: string = 'Non spécifié';
  carbonOffset = false;
  finalPrice = 0;
  offsetPercentage = 0.05;

  @ViewChild(PaymentDialogComponent) paymentDialog: PaymentDialogComponent | undefined;

  constructor(private router: Router, private dialog: MatDialog, private activatedRoute: ActivatedRoute, private contratService: ContratService) { }

  ngOnInit(): void {
    // Récupérer le nom de l'utilisateur actuel
    this.contratService.getCurrentUser().then(
      (user) => {
        this.currentUserName = `${user.prenom} ${user.nom}`; // Récupérer le champ `nom` depuis la réponse
        console.log('Utilisateur actuel:', user);
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
      }
    );

    this.activatedRoute.paramMap.subscribe(params => {
      const state = history.state;
      if (state && state['selectedPlan'] && state['formData']) {
        this.selectedPlan = state['selectedPlan'];
        this.formData = state['formData'];

        console.log('Données de l\'offre:', this.selectedPlan);
        console.log('Données du formulaire:', this.formData);
        this.finalPrice = this.selectedPlan.price;
        if (this.selectedPlan) {
          this.updatePrice();
        }}
         else {
        console.error('State or required data is not available');
        this.router.navigate(['/error-page']);
      }
    });
  }

  openConditions(): void {
    const dialogRef = this.dialog.open(ConditionsDialogComponent, {
      width: '80%',
      height: '60%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.acceptTerms = true;
      }
    });
  }

  openReforestationDialog(): void {
    this.dialog.open(ReforestationDialogComponent, {
      width: '80%',
      height: '60%',
    });
  }

  finalizeContract() {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '400px',
      disableClose: true,
      data: { finalPrice: this.finalPrice },
    });

    // Listen for the event from the dialog and call generatePDF when the event is triggered
    dialogRef.componentInstance.paymentConfirmed.subscribe(() => {
      this.generateAndSaveContract();
    });
  }

  updatePrice() {
    if (this.selectedPlan && this.selectedPlan.price) {
      // Remove the currency symbol and convert to a number
      const priceValue = parseFloat(this.selectedPlan.price.replace('€', '').trim());
      
      if (isNaN(priceValue)) {
        console.warn('Invalid price value');
        this.finalPrice = 0;
      } else {
        this.finalPrice = this.carbonOffset
          ? priceValue * (1 + this.offsetPercentage)
          : priceValue;
      }
    } else {
      console.warn('selectedPlan or its price is undefined');
      this.finalPrice = 0; 
    }
  } 
  

  async generateAndSaveContract() {
    try {
      // Générer le PDF
      const pdfBlob = this.generatePDF();

      // Sauvegarde locale pour tester le fichier PDF généré
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contract_test.pdf';
      a.click();

      console.log('PDF sauvegardé localement pour test.');


      // Sauvegarder les données du contrat via l'API
      const contractData = {
        ...this.formData,
        planName: this.selectedPlan.name,
        price: `${this.finalPrice.toFixed(2)} €`,
        descriptionOffre: this.selectedPlan.description
      };
      console.log('Envoi des données du contrat :', contractData);

      // Convertir le Blob en File
      const pdfFile = new File([pdfBlob], 'contract.pdf', { type: 'application/pdf' });

      await this.contratService.createContract(contractData, pdfFile);

      console.log('Contrat et PDF sauvegardés avec succès.');

       // Afficher le message de succès
       alert('Votre contrat a été généré et sauvegardé avec succès !'); 

      // Redirection vers /mescontrats après succès
      this.router.navigate(['/mes-contrats']);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du contrat ou du PDF :', error);
    }
  }

  
  generatePDF(): Blob {
    const doc = new jsPDF.default();
    const pageHeight = doc.internal.pageSize.height;
    let cursorY = 18;
  
    // Ajouter le logo au début du PDF
    const logoUrl = 'assets/img/logo-mobi.png'; // Chemin de ton logo
    doc.addImage(logoUrl, 'PNG', 20, cursorY, 40, 15); // Le logo sera de 40x15 mm
    cursorY += 20;  // Décalage après le logo
  
    // Titre du contrat avec couleur
    doc.setFontSize(20);
    doc.setTextColor(56, 142, 60); 
    doc.setFont('helvetica', 'bold');
    doc.text('MobiSureMoinsDeCO2 Assurance', 105, cursorY, { align: 'center' });
    cursorY += 10;
  
    doc.setFontSize(14);
    doc.text('Contrat d\'assurance', 105, cursorY, { align: 'center' });
    cursorY += 10;
    doc.line(10, cursorY, 200, cursorY); // Ligne sous le titre
    cursorY += 10;
  
    // Informations personnelles (titre en gras et couleur)
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0); // Noir pour les titres
    doc.text('Vos Informations :', 10, cursorY);
    cursorY += 10;
  
    // Fonction pour ajouter une ligne de données
    const addLine = (label: string, value: string | undefined, color: string = 'black') => {
      if (value) {
        if (cursorY + 10 > pageHeight) {
          doc.addPage();
          cursorY = 20;
        }
        doc.setTextColor(color);
        doc.text(`${label}: ${value}`, 20, cursorY);
        cursorY += 7;
      }
    };
  
    // Informations
    addLine('Durée du Contrat', this.formData.dureeContrat); // Couleur verte
    addLine('Date de Début', this.formData.debutContrat);
    addLine('Destination', this.formData.destination);
    addLine('Date Aller', this.formData.dateAller);
    addLine('Date Retour', this.formData.dateRetour);
    addLine('Date de Naissance du Souscripteur', this.formData.dateNaissanceSouscripteur);
    addLine('Téléphone', this.formData.numeroTelephone);
  
    if (this.formData.assurerTransport === 'true') {
      addLine('Transport Assuré', 'Oui');
    }
  
    const transportTypes: string[] = [];
    if (this.formData.voiture === 'true') transportTypes.push('Voiture');
    if (this.formData.trotinette === 'true') transportTypes.push('Trotinette');
    if (this.formData.bicyclette === 'true') transportTypes.push('Bicyclette');
    if (transportTypes.length) {
      addLine('Type de Transport', transportTypes.join(' & '), '#388e3c'); // Couleur verte
    }
  
     // Add Insured Persons
     if (this.formData.nombrePersonnes > 0) {
      addLine('Personnes Assurées', `${this.formData.nombrePersonnes, '#388e3c'}`);
      this.formData.accompagnants.forEach((person: any, index: number) => {
        if (cursorY + 50 > pageHeight) {
          doc.addPage();
          cursorY = 20;
        }
        doc.text(`Personne ${index + 1} :`, 30, cursorY);
        cursorY += 7;
        doc.text(`Nom : ${person.nom}`, 40, cursorY);
        cursorY += 7;
        doc.text(`Prénom : ${person.prenom}`, 40, cursorY);
        cursorY += 7;
        doc.text(`Sexe : ${person.sexe}`, 40, cursorY);
        cursorY += 7;
        doc.text(`Date Naissance : ${person.dateNaissance}`, 40, cursorY);
        cursorY += 7;
      });
    }

    doc.line(10, cursorY, 200, cursorY);
    cursorY += 10;
  
    // Caractéristiques de l'offre (titre en gras et couleur)
    if (cursorY + 30 > pageHeight) {
      doc.addPage();
      cursorY = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Caractéristiques :', 10, cursorY);
    cursorY += 10;
    doc.setFont('helvetica', 'normal');
    const features = this.selectedPlan.description.split('\\n');
    features.forEach((feature: string) => {
      if (cursorY + 10 > pageHeight) {
        doc.addPage();
        cursorY = 20;
      }
      doc.text(`- ${feature}`, 20, cursorY);
      cursorY += 7;
    });
  
    // Ajouter la signature
    if (cursorY + 70 > pageHeight) {
      doc.addPage();
      cursorY = 20;
    }
    const signatureStartY = pageHeight - 60;
  
    doc.setDrawColor(0);
    const frameWidth = 70;
    const frameHeight = 42;
  
    // Signature de l'entreprise
    doc.rect(20, signatureStartY, frameWidth, frameHeight);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('MobiSureMoinsDeCO2 Assurance', 25, signatureStartY + 10);
    doc.addImage('assets/img/signature.png', 'PNG', 25, signatureStartY + 15, 50, 15); // Exemple de signature de l'entreprise
    doc.setFont('helvetica', 'bold');
    const formattedDate = new Date().toLocaleDateString('fr-FR');
    doc.text(`Date : ${formattedDate}`, 25, signatureStartY + 35);
  
    // Signature du client
    doc.rect(120, signatureStartY, frameWidth, frameHeight);
    doc.setFont('helvetica', 'bold');
    doc.text('Pour le Titulaire', 125, signatureStartY + 10);
    doc.setFont('courier', 'bold');
    doc.text(this.currentUserName || 'Non spécifié', 135, signatureStartY + 20);
    doc.setFont('helvetica', 'bold');
    doc.text(`Date : ${formattedDate}`, 125, signatureStartY + 35);
  
    // Convertir le document en Blob pour téléchargement
    return doc.output('blob');
  } 

}

@Component({
  selector: 'app-conditions-dialog',
  template: `
  <div class="dialog-container">
    <div class="logo-container">
      <img src="assets/img/logo-mobi.png" alt="Logo MobiSureMoinsDeCO2" class="logo">
    </div>
    <h1 class="dialog-header">Conditions Générales</h1>
    <div class="dialog-content">
      <p><strong>1. Objet du Contrat :</strong> Ce contrat a pour objet de définir les termes et conditions d'abonnement aux services d'assurance proposés par MobiSureMoinsDeCO2.</p>
      <p><strong>2. Durée du Contrat :</strong> Le contrat est valide pour une durée déterminée spécifiée au moment de l'activation de l'abonnement.</p>
      <p><strong>3. Modalités de Paiement :</strong> Le paiement doit être effectué par carte bancaire ou tout autre moyen indiqué sur le site.</p>
      <p><strong>4. Couverture d'Assurance :</strong> L'abonnement offre une couverture pour les transports sélectionnés (voiture, trottinette, bicyclette), avec des exclusions précisées dans les termes.</p>
      <p><strong>5. Responsabilités :</strong> MobiSureMoinsDeCO2 n'est pas responsable des accidents ou des dommages en dehors des conditions couvertes par le contrat d'assurance.</p>
      <p><strong>6. Confidentialité :</strong> Nous nous engageons à protéger vos données personnelles conformément à la politique de confidentialité.</p>
      <p><strong>7. Acceptation des Conditions :</strong> L'abonnement prend effet uniquement lorsque l'utilisateur accepte ces conditions générales et la politique de confidentialité en toute connaissance de cause.</p>
    </div>
    <button mat-button (click)="close()" class="close-btn">Fermer</button>
  </div>
  `,
  styles: [
    `
      .dialog-container {
        background-color: #f1f8e9; /* Fond vert clair */
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        margin: auto;
        text-align: left;
      }

      .dialog-header {
        font-size: 28px;
        color: #388e3c; /* Vert foncé */
        margin-bottom: 20px;
        text-align: center;
        font-family: 'Roboto', sans-serif;
        font-weight: bold;
      }

      .dialog-content {
        font-size: 16px;
        color: #4caf50; /* Vert moyen */
        line-height: 1.7;
        font-family: 'Roboto', sans-serif;
        margin-bottom: 20px;
      }

      .dialog-content p {
        margin-bottom: 15px;
      }

      .dialog-content strong {
        color: #388e3c;
      }

      .logo-container {
        text-align: center;
        margin-bottom: 20px;
      }

      .logo {
        max-width: 150px; 
        margin: 0 auto;
      }

      .close-btn {
        display: block;
        width: 100%;
        background-color: #4caf50; /* Vert primaire */
        color: white;
        padding: 12px;
        border-radius: 25px;
        font-size: 18px;
        font-weight: bold;
        text-transform: uppercase;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s;
      }

      .close-btn:hover {
        background-color: #388e3c; /* Vert foncé au survol */
      }

      .close-btn:focus {
        outline: none;
      }
    `
  ]
})
export class ConditionsDialogComponent {
  constructor(private dialogRef: MatDialogRef<ConditionsDialogComponent>) { }

  close(): void {
    this.dialogRef.close(true);
  }
}