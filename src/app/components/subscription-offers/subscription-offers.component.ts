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
  offre: any; // Variable pour stocker les données de l'offre

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Récupère l'offre envoyée via le router
    this.offre = history.state.offre;
    console.log('Données de l\'offre reçues:', this.offre);
  }
}
