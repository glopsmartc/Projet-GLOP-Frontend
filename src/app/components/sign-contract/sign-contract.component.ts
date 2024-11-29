import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-sign-contract',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sign-contract.component.html',
  styleUrls: ['./sign-contract.component.css']
})
export class SignContractComponent implements OnInit {
  formData: any;
  selectedPlan: any;
  isLoading = false;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    let state = this.router.getCurrentNavigation()?.extras.state;
    if (!state) {
      state = history.state; // Fallback to history state if Angular state is not available

    }

    if (state && state['selectedPlan'] && state['formData']) {
      this.selectedPlan = state['selectedPlan'];
      this.formData = state['formData'];
      console.log('Données de l\'offre:', this.selectedPlan);
      console.log('Données du formulaire:', this.formData);
    } else {
      console.error('State or required data is not available');
      // this.router.navigate(['/error-page']);
    }
  }

  finalizeContract() {
    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);

    setTimeout(() => {
      this.generatePDF();
    }, 3000);

  }

  generatePDF() {
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

    doc.save('Contract.pdf');
  }
}
