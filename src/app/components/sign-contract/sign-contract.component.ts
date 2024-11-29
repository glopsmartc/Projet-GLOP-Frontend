import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router) { }

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
      // You could redirect to an error page or handle this case more gracefully
      // this.router.navigate(['/error-page']);
    }
  }

  finalizeContract() {
    console.log("Contract finalized!");
    // Implement your contract finalization logic here
  }
}
