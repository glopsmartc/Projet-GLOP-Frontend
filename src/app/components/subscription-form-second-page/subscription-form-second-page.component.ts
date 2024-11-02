import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule } from '@angular/forms'; 
import { ActivatedRoute, Router } from '@angular/router';
import { ContratService } from '../services/contrat.service'; 

@Component({
  selector: 'app-subscription-form-second-page',
  templateUrl: './subscription-form-second-page.component.html',
  styleUrls: ['./subscription-form-second-page.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule] 
})
export class SubscriptionFormSecondPageComponent implements OnInit {
  detailsForm: FormGroup;
  nombrePersonnes: number = 0;
  accompagnants: FormArray;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private contratService: ContratService) {
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
      numeroTelephone: ['']
    });

    this.route.queryParams.subscribe(params => {
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
        numeroTelephone: params['numeroTelephone']
      });
    });
  }

  ngOnInit(): void {
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

  async onSubmit() {
    console.log(this.detailsForm.value); // Affiche les valeurs du formulaire

    try {
      const offreCorrespondante = await this.contratService.getOffreCorrespondante(this.detailsForm.value);
      console.log('Offre correspondante:', offreCorrespondante);
      
      // Rediriger vers l'interface des offres
      this.router.navigate(['/subscription-offers'], { state: { offre: offreCorrespondante } });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'offre:', error);
    }
  }
}
