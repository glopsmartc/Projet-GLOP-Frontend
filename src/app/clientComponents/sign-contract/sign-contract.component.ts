import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as jsPDF from 'jspdf';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PaymentDialogComponent } from '../../modalDialogs/payment-dialog/payment-dialog.component'; // <-- Import PaymentDialogComponent
import { ContratService } from '../../services/contrat.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
      } else {
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

  finalizeContract() {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '400px',
      disableClose: true,
    });

    // Listen for the event from the dialog and call generatePDF when the event is triggered
    dialogRef.componentInstance.paymentConfirmed.subscribe(() => {
      this.generateAndSaveContract();
    });
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
        price: this.selectedPlan.price,
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
  
    // Add Header
    doc.setFontSize(20);
    doc.text('MobiSureMoinsDeCO2 Assurance', 105, cursorY, { align: 'center' });
    cursorY += 10;
    doc.setFontSize(14);
    doc.text('Contrat d\'assurance', 105, cursorY, { align: 'center' });
    cursorY += 10;
    doc.line(10, cursorY, 200, cursorY);
    cursorY += 10;
  
    // Add Contract Details
    doc.setFont('helvetica', 'bold');
    doc.text('Vos Informations :', 10, cursorY);
    cursorY += 10;
  
    doc.setFont('helvetica', 'normal');
    const addLine = (label: string, value: string | undefined) => {
      if (value) {
        if (cursorY + 10 > pageHeight) {
          doc.addPage();
          cursorY = 20;
        }
        doc.text(`${label}: ${value}`, 20, cursorY);
        cursorY += 7;
      }
    };
  
    addLine('Durée du Contrat', this.formData.dureeContrat);
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
      addLine('Type de Transport', transportTypes.join(' & '));
    }
  
    // Add Insured Persons
    if (this.formData.nombrePersonnes > 0) {
      addLine('Personnes Assurées', `${this.formData.nombrePersonnes}`);
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
  
    // Add Features
    if (cursorY + 30 > pageHeight) {
      doc.addPage();
      cursorY = 20;
    }
    doc.setFont('helvetica', 'bold');
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
  
    // Add Signatures
    if (cursorY + 70 > pageHeight) {
      doc.addPage();
      cursorY = 20;
    }
    const signatureStartY = pageHeight - 60;
  
    doc.setDrawColor(0);
    const frameWidth = 70;
    const frameHeight = 42;
  
    // Company Signature
    doc.rect(20, signatureStartY, frameWidth, frameHeight);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('MobiSureMoinsDeCO2 Assurance', 25, signatureStartY + 10);
    doc.addImage('assets/img/signature.png', 'PNG', 25, signatureStartY + 15, 50, 15);
    doc.setFont('helvetica', 'bold');
    const formattedDate = new Date().toLocaleDateString('fr-FR');
    doc.text(`Date : ${formattedDate}`, 25, signatureStartY + 35);
  
    // Client Signature
    doc.rect(120, signatureStartY, frameWidth, frameHeight);
    doc.setFont('helvetica', 'bold');
    doc.text('Pour le Titulaire', 125, signatureStartY + 10);
    doc.setFont('courier', 'bold');
    doc.text(this.currentUserName || 'Non spécifié', 135, signatureStartY + 20);
    doc.setFont('helvetica', 'bold');
    doc.text(`Date : ${formattedDate}`, 125, signatureStartY + 35);
  
    // Convert to Blob
    return doc.output('blob');
  }
  


}

@Component({
  selector: 'app-conditions-dialog',
  template: `
  <div class="p-5">
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
      .dialog-header {
      font-size: 24px;
      text-align: center;
      color: #3f51b5;
      margin-bottom: 20px;
    }

    .dialog-content {
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 30px;
    }

    .dialog-content p {
      margin: 10px 0;
    }

    .close-btn {
      display: block;
      margin: 0 auto;
      font-size: 16px;
      background-color: #3f51b5;
      color: white;
      padding: 10px 20px;
      border: none;
      cursor: pointer;
      border-radius: 5px; 
    }

    .close-btn:hover {
      background-color: #303f9f;
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