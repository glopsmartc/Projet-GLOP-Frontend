import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscription-offers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription-offers.component.html',
  styleUrls: ['./subscription-offers.component.css']
})
export class SubscriptionOffersComponent implements OnInit {
  offre: any;
  formData: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    let state = this.router.getCurrentNavigation()?.extras.state;
    if (!state) {
      state = history.state; // Fallback to history state if Angular state is not available

    }
    
    if (state && state['offre'] && state['formData']) {
      this.offre = state['offre'];
      this.formData = state['formData'];
      console.log('Données de l\'offre reçues:', this.offre);
      console.log('Données du formulaire reçues:', this.formData);
    } else {
      console.error('State or required data is not available');
    }
  }

  navigateToSignContract(planType: string): void {
    if (!this.offre) {
      console.error('Offre is not available!');
      return;
    }

    const selectedPlan = {
      type: planType,
      name: this.offre.nomOffre,
      price: planType === 'standard' ? this.offre.prixMinTotal : this.offre.prixMaxTotal,
      description: planType === 'standard' ? this.offre.descriptionMin : this.offre.descriptionMax
    };

    // Pass selected plan and formData to sign contract component
    this.router.navigate(['/sign-contract'], {
      state: { selectedPlan, formData: this.formData }
    });
  }
}
