import { Component , OnInit} from '@angular/core';
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
export class CalculateEmissionComponent implements OnInit {
  km: number = 0;
  selectedTransport: string = '';
  vehicleMake: string = '';
  vehicleModel: string = '';
  vehicleMakes: any[] = []; // Liste des marques
  vehicleModels: any[] = []; // Liste des modèles
  transports: { id: number, name: string }[] = [
    { id: 1, name: 'Avion' },
    { id: 2, name: 'TGV' },
    { id: 3, name: 'Intercités' },
    /*{ id: 4, name: 'Voiture thermique' },
    { id: 5, name: 'Voiture électrique' },*/
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

  ngOnInit(): void {
      this.loadVehicleMakes(); //charger les marques au démarrage
    }

    // Charger la liste des marques
  loadVehicleMakes(): void {
    this.emissionCo2Service.getVehicleMakes().subscribe({
      next: (response) => {
        console.log('Réponse de l\'API vehicle_makes :', response); // Inspectez la réponse
        // Extraire les noms des marques à partir de la propriété `make`
        this.vehicleMakes = response.data.map((item: any) => item.make);
        console.log('Liste des marques extraites :', this.vehicleMakes);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des marques de véhicules.';
        console.error('Erreur :', error);
      }
    });
  }

  //charger la liste des modèles lorsqu'une marque est sélectionnée
  onMakeSelected(make: string): void {
    console.log('Marque sélectionnée :', make);
    if (make) {
      this.emissionCo2Service.getVehicleModels(make).subscribe({
        next: (response) => {
          console.log('Réponse de l\'API vehicle_models :', response);
          // Extraire les noms des modèles à partir de la propriété `model`
          this.vehicleModels = response.data.map((item: any) => item.model);
          console.log('Liste des modèles extraits :', this.vehicleModels);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors du chargement des modèles de véhicules.';
          console.error('Erreur :', error);
        }
      });
    } else {
      this.vehicleModels = []; //réinitialise la liste des modeles si aucune marque n'est sélectionnée
    }
  }

  calculateEmissions() {
    if (this.selectedTransport === 'voiture') {
      this.emissionCo2Service.estimateVehicleEmissions(this.vehicleMake, this.vehicleModel, this.km).subscribe({
        next: (response) => {
          // Vérifier si la réponse contient les données attendues
          if (response.data && response.data.co2e_kg) {
            const carbonEmissions = response.data.co2e_kg; // Extraire co2e_kg
            this.emissions = [{
              name: `${this.vehicleMake} ${this.vehicleModel}`,
              value: carbonEmissions // Utiliser co2e_kg ici
            }];
          } else {
            this.errorMessage = 'Données de l\'API non valides.';
          }
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la récupération des données.';
          console.error('Erreur backend :', error);
        }
      });
    } else {
      // Logique existante pour les autres transports
      this.emissionCo2Service.calculateEmissions(this.km, parseInt(this.selectedTransport)).subscribe({
        next: (response) => {
          this.emissions = Array.isArray(response.data) ? response.data : [response.data];
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la récupération des données.';
          console.error('Erreur backend :', error);
        }
      });
    }
  }
}
