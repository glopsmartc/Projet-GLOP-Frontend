import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as jsPDF from 'jspdf';
import { MatDialog, MatDialogModule,  MatDialogRef} from '@angular/material/dialog';
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
  @ViewChild(PaymentDialogComponent) paymentDialog: PaymentDialogComponent | undefined;

  constructor(private router: Router, private dialog: MatDialog, private activatedRoute: ActivatedRoute, private contratService: ContratService) { }

  ngOnInit(): void {
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

    if (!this.formData || !this.formData.dureeContrat) {
      console.error('Form data or contract duration is missing');
      //return new Blob(); 
    }

    const doc = new jsPDF.default();
    doc.text('MobiSureMoinsDeCO2 Assurance', 10, 10);
    doc.text(`Contract for ${this.selectedPlan.name}`, 10, 20);
    doc.text(`Price: ${this.selectedPlan.price}`, 10, 30);
    doc.text('Features:', 10, 40);

    const features = this.selectedPlan.description.split('\n');
    features.forEach((feature: string, index: number) => {
      doc.text(`- ${feature}`, 10, 50 + index * 10);
    });

    doc.text('Client Information:', 10, 70 + features.length * 10);
    doc.text(`Contract Duration: ${this.formData.dureeContrat}`, 10, 80 + features.length * 10);
    doc.text(`Start Date: ${this.formData.debutContrat}`, 10, 90 + features.length * 10);

    doc.text('Signature: MobiSureMoinsDeCO2 Assurance', 10, 120 + features.length * 10);

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

