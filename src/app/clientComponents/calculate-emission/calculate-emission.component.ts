import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-calculate-emission',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './calculate-emission.component.html',
  styleUrl: './calculate-emission.component.css'
})
export class CalculateEmissionComponent {
  km: number = 0; // Propriété pour stocker la distance
  selectedTransport: number = 2; // Valeur par défaut : TGV (2)
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


  constructor(private http: HttpClient) { } // Injection du service HttpClient

  // Méthode pour calculer les émissions
  calculateEmissions() {
    const apiUrl = 'https://impactco2.fr/api/v1/transport';
    const apiKey = '4fd577a1-4bac-49aa-acdd-fb2ef9d7d294';

    const headers = {
      'Authorization': `Bearer ${apiKey}` // ajout le token d'authentification
    };

    const params = {
      km: this.km.toString(),
      transports: this.selectedTransport.toString()
    };

    this.http.get<any>(apiUrl, { headers, params }).subscribe({
      next: (response) => {
        this.emissions = response.data; // Stockage des données d'émission
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la récupération des données.';
        console.error(error);
      }
    });
  }

}
