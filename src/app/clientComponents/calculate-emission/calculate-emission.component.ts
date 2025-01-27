import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmissionCo2Service } from '../../services/emission-co2.service'; 

@Component({
  selector: 'app-calculate-emission',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculate-emission.component.html',
  styleUrls: ['./calculate-emission.component.css']
})
export class CalculateEmissionComponent {
  km: number = 0;
  selectedTransport: number = 2;
  transports: { id: number, name: string }[] = [
    { id: 1, name: 'Avion' },
    { id: 2, name: 'TGV' },
    { id: 3, name: 'Intercités' },
    { id: 4, name: 'Voiture thermique' },
    { id: 5, name: 'Voiture électrique' },
    { id: 6, name: 'Autocar' },
    { id: 7, name: 'Vélo ou marche' },
    { id: 8, name: 'Vélo (ou trottinette) à assistance électrique' },
    { id: 9, name: 'Bus thermique' },
    { id: 10, name: 'Tramway' },
    { id: 11, name: 'Métro' },
    { id: 12, name: 'Scooter ou moto légère' },
    { id: 13, name: 'Moto' },
    { id: 14, name: 'RER ou Transilien' },
    { id: 15, name: 'TER' },
    { id: 16, name: 'Bus électrique' },
    { id: 21, name: 'Bus (GNV)' }
  ];
  emissions: any[] = [];
  errorMessage: string = '';

  constructor(private emissionCo2Service: EmissionCo2Service) { }

 calculateEmissions() {
  this.emissionCo2Service.calculateEmissions(this.km, this.selectedTransport).subscribe({
    next: (response) => {
      console.log('Données reçues du backend :', response); 
     this.emissions = Array.isArray(response.data) ? response.data : [response.data]; 
      console.log('Données dans emissions :', this.emissions); 
      this.errorMessage = '';
    },
    error: (error) => {
      this.errorMessage = 'Erreur lors de la récupération des données.';
      console.error('Erreur backend :', error);
    }
  });
}
}