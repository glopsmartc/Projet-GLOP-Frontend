import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContratService } from '../../services/contrat.service';
import { EmissionCo2Service } from '../../services/emission-co2.service';

@Component({
  selector: 'app-subscription-form-second-page',
  templateUrl: './subscription-form-second-page.component.html',
  styleUrls: ['./subscription-form-second-page.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class SubscriptionFormSecondPageComponent implements OnInit {
  currentStep: number = 1;
  detailsForm: FormGroup;
  accompagnants: FormArray;
  nombrePersonnes: number = 0;
  dureeContrat: string = '';
  labelDistance: string = 'Distance parcourue approximative (km)';

  km: number = 0;
  selectedTransport: string = '';
  vehicleMake: string = '';
  vehicleModel: string = '';
  vehicleMakes: any[] = [];
  vehicleModels: any[] = [];
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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contratService: ContratService,
    private emissionCo2Service: EmissionCo2Service
  ) {
    this.accompagnants = this.fb.array([]); // Initialisation ici
    this.detailsForm = this.fb.group({
      accompagnants: this.accompagnants,
      dateNaissanceSouscripteur: [''],
      assurerTransport: [''],
      voiture: [''],
      trotinette: [''],
      bicyclette: [''],
      assurerPersonnes: [''],
      dureeContrat: [''],
      debutContrat: [''],
      dateAller: [''],
      dateRetour: [''],
      destination: [''],
      numeroTelephone: [''],
      nombrePersonnes: ['']
    });

    this.route.queryParams.subscribe(params => {
      console.log('Query Params:', params); // Log pour débogage
      this.nombrePersonnes = +params['nombrePersonnes'] || 0;
      this.initAccompagnants(this.nombrePersonnes);

      // Récupérer les autres champs
      this.detailsForm.patchValue({
        assurerTransport: params['assurerTransport'],
        voiture: params['voiture'],
        trotinette: params['trotinette'],
        bicyclette: params['bicyclette'],
        assurerPersonnes: params['assurerPersonnes'],
        dureeContrat: params['dureeContrat'],
        debutContrat: params['debutContrat'],
        dateAller: params['dateAller'],
        dateRetour: params['dateRetour'],
        destination: params['destination'],
        numeroTelephone: params['numeroTelephone'],
        nombrePersonnes: this.nombrePersonnes
      });
    });
  }

  private initAccompagnants(nombre: number) {
    // efface tous les contrôles existants
    this.accompagnants.clear();
    // ajoute les groupes de contrôles selon le nombre de personnes accompagnantes
    for (let i = 0; i < nombre; i++) {
      this.accompagnants.push(this.fb.group({
        nom: [''],
        prenom: [''],
        sexe: [''],
        dateNaissance: ['']
      }));
    }
  }

  goToNextStep() {
    if (this.detailsForm.valid) {
      this.currentStep = 2; // Passe à la seconde page
    }
  }

  ngOnInit(): void {
    this.loadVehicleMakes(); //charger les marques au démarrage
    this.route.queryParams.subscribe(params => {
      this.dureeContrat = params['dureeContrat'] || '1_voyage';
      this.updateLabel();
    });
  }

  updateLabel() {
    const labels: { [key: string]: string } = {
      '1_voyage': 'Distance à parcourir pour ce voyage (km)',
      '1_mois': 'Distance parcourue approximative en 1 mois (km)',
      '3_mois': 'Distance parcourue approximative en 3 mois (km)',
      '6_mois': 'Distance parcourue approximative en 6 mois (km)',
      '1_an': 'Distance parcourue approximative en 1 an (km)'
    };
    this.labelDistance = labels[this.dureeContrat] || 'Distance parcourue approximative (km)';
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

  async onSubmit() {
    console.log(this.detailsForm.value); // Affiche les valeurs du formulaire
    const formData = this.detailsForm.value;

    try {
      const offreCorrespondante = await this.contratService.getOffreCorrespondante(this.detailsForm.value);
      console.log('Offre correspondante:', offreCorrespondante);

      // Rediriger vers l'interface des offres
      this.router.navigate(['/subscription-offers'], {
        state: {
          offre: offreCorrespondante, // selected offer from service
          formData: formData // form data collected
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'offre:', error);
    }
  }
}
