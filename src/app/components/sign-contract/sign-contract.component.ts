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
        this.currentUserName = user.nom; // Récupérer le champ `nom` depuis la réponse
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
      };
      console.log('Envoi des données du contrat :', contractData);

      // Convertir le Blob en File
      const pdfFile = new File([pdfBlob], 'contract.pdf', { type: 'application/pdf' });

      await this.contratService.createContract(contractData, pdfFile);

      console.log('Contrat et PDF sauvegardés avec succès.');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du contrat ou du PDF :', error);
    }
  }

  generatePDF(): Blob {
    const doc = new jsPDF.default();
  
    // Ajouter un en-tête avec logo et titre
    doc.setFontSize(20);
    doc.text('MobiSureMoinsDeCO2 Assurance', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Contrat d\'assurance', 105, 30, { align: 'center' });
    doc.line(10, 35, 200, 35); // Ligne séparatrice
  
    // Section Détails du contrat
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Détails du contrat :', 10, 50);
  
    doc.setFont('helvetica', 'normal');
    doc.text('Offre :', 20, 60);
    doc.text(this.selectedPlan.name, 60, 60);
  
    doc.text('Prix :', 20, 70);
    doc.text(`${this.selectedPlan.price}`, 60, 70);
  
    doc.text('Durée :', 20, 80);
    doc.text(this.formData.dureeContrat, 60, 80);
  
    doc.text('Date de début :', 20, 90);
    doc.text(this.formData.debutContrat || 'Non spécifiée', 60, 90);
  
    doc.line(10, 100, 200, 100); // Ligne séparatrice
  
    // Section Caractéristiques
    doc.setFont('helvetica', 'bold');
    doc.text('Caractéristiques :', 10, 110);
  
    doc.setFont('helvetica', 'normal');
    const features = this.selectedPlan.description.split('\n');
    features.forEach((feature: string, index: number) => {
        doc.text(`- ${feature}`, 20, 120 + index * 10);
    });
  
    const lastFeatureY = 120 + features.length * 10;
  
    doc.line(10, lastFeatureY + 10, 200, lastFeatureY + 10); // Ligne séparatrice
  
    // Obtenir la date actuelle
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('fr-FR'); // Format français
  
    // Position de départ pour le bloc de signature
    const signatureStartY = lastFeatureY + 40; // Ajusté pour réduire l’espace
  
    // Dimensions des cadres
    const frameWidth = 80;
    const frameHeight = 50; // Augmenter légèrement la hauteur pour inclure la date
  
    // Chemin ou base64 de l'image de signature
    const signatureImage = 'assets/img/signature.png'; 
  
    // Cadre pour la signature de l'entreprise
    doc.setDrawColor(0);
    doc.rect(20, signatureStartY, frameWidth, frameHeight); // Rectangle pour l'entreprise
    doc.setFont('courier', 'bold');
    doc.text('MobiSureMoinsDeCO2 Assurance', 25, signatureStartY + 10); // Texte dans le rectangle
    doc.addImage(signatureImage, 'PNG', 25, signatureStartY + 15, 50, 15); // Ajouter l'image de la signature
    doc.setFont('helvetica', 'italic');
    doc.text(`Date : ${formattedDate}`, 25, signatureStartY + 40); // Ajouter la date sous l'image
  
    // Cadre pour la signature du titulaire
    doc.rect(120, signatureStartY, frameWidth, frameHeight); // Rectangle pour le titulaire
    doc.setFont('courier', 'bold');
    doc.text('Pour le Titulaire', 125, signatureStartY + 10); // Texte dans le rectangle
    doc.setFont('helvetica', 'italic');
    doc.text('', 125, signatureStartY + 20);
    doc.setFont('helvetica', 'bold');
    doc.text(this.currentUserName || 'Non spécifié', 135, signatureStartY + 20); // Utiliser le nom récupéré
    doc.setFont('helvetica', 'italic');
    doc.text(`Date : ${formattedDate}`, 125, signatureStartY + 40); // Ajouter la date pour le titulaire
  
    // Ligne de séparation (facultatif)
    doc.line(10, signatureStartY + frameHeight + 10, 200, signatureStartY + frameHeight + 10);
  
    // Convertir en Blob
    return doc.output('blob');
  }

}

@Component({
  selector: 'app-conditions-dialog',
  template: `
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
    }

    .close-btn:hover {
      background-color: #303f9f;
    }

    `
  ]
})
export class ConditionsDialogComponent {
  constructor(private dialogRef: MatDialogRef<ConditionsDialogComponent>) {}

  close(): void {
    this.dialogRef.close(true);
  }
}