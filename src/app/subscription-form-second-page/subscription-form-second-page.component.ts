import { Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule } from '@angular/forms'; 
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subscription-form-second-page',
  templateUrl: './subscription-form-second-page.component.html',
  styleUrls: ['./subscription-form-second-page.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule] 
})
export class SubscriptionFormSecondPageComponent implements OnInit{
  detailsForm: FormGroup;
  nombrePersonnes: number = 0;
  accompagnants: FormArray;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.detailsForm = this.fb.group({
      accompagnants: this.fb.array([]) 
    });

    // recupere le nombre de personnes depuis les parametres de requete
    this.route.queryParams.subscribe(params => {
      this.nombrePersonnes = +params['nombrePersonnes'] || 0;
      this.initAccompagnants(this.nombrePersonnes);
    });
    this.accompagnants = this.detailsForm.get('accompagnants') as FormArray;
  }
  ngOnInit(): void {
    // recupere les parametres de requete pour nombrePersonnes et initialise les champs
    this.route.queryParams.subscribe(params => {
      this.nombrePersonnes = +params['nombrePersonnes'] || 0;
      this.initAccompagnants(this.nombrePersonnes);
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

  onSubmit() {
    console.log(this.detailsForm.value);
  }
}
