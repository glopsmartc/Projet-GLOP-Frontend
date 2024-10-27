import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-subscription-form',
  templateUrl: './subscription-form.component.html',
  styleUrls: ['./subscription-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class SubscriptionFormComponent {
  myForm: FormGroup;

  showAssurerTransport = false;
  showAssurerPersonnes = false;
  showDebutContrat = false;
  showDateAllerRetour = false;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      assurerTransport: [false],
      voiture: [false],
      trotinette: [false],
      bicyclette: [false],
      assurerPersonnes: [false],
      nombrePersonnes: [''],
      numeroTelephone: ['', Validators.required],
      dureeContrat: ['', Validators.required],
      debutContrat: ['', Validators.required],
      dateAller: [''],
      dateRetour: [''],
    });
      // Écoute les changements sur "dureeContrat"
      this.myForm.get('dureeContrat')?.valueChanges.subscribe(value => {
        this.updateCheckboxVisibility(value);
      });
    }
    updateCheckboxVisibility(duree: string) {
      // Réinitialise les champs de choix
      this.myForm.get('assurerTransport')?.setValue(false);
      this.myForm.get('assurerPersonnes')?.setValue(false);
  
      // Affiche les options selon la durée choisie
      if (duree === '1_voyage') {
        this.showAssurerTransport = false;
        this.showAssurerPersonnes = true;
        this.showDebutContrat = false;
        this.showDateAllerRetour = true;

      } else {
        this.showAssurerTransport = true;
        this.showAssurerPersonnes = true;
        this.showDebutContrat = true;
        this.showDateAllerRetour = false;
      }
    }
  
  onSubmit() {
    console.log(this.myForm.value);
  }
}
