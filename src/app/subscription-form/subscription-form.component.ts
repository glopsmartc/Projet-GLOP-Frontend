import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-subscription-form',
  templateUrl: './subscription-form.component.html',
  styleUrls: ['./subscription-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class SubscriptionFormComponent {
  myForm: FormGroup;
  countries: string[] = []; // Liste de pays pour le champ destination

  showAssurerTransport = false;
  showAssurerPersonnes = false;
  showDebutContrat = false;
  showDateAllerRetourDestination = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
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
      destination: [''],
    });
      // Écoute les changements sur "dureeContrat"
      this.myForm.get('dureeContrat')?.valueChanges.subscribe(value => {
        this.updateCheckboxVisibility(value);
      });
      this.loadCountries();//pour charger la liste des pays dès que le composant est initialisé
    }

    loadCountries() {
      const url = 'https://restcountries.com/v3.1/all';
      this.http.get<any[]>(url).subscribe((data) => {
        this.countries = data.map(country => country.name.common);
        this.countries.sort(); 
      });
    }

    updateCheckboxVisibility(duree: string) {
      // Réinitialise les champs de choix
      this.myForm.get('assurerTransport')?.setValue(false);
      this.myForm.get('assurerPersonnes')?.setValue(false);
      this.myForm.get('destination')?.setValue('');
  
      // Affiche les options selon la durée choisie
      if (duree === '1_voyage') {
        this.showAssurerTransport = false;
        this.showAssurerPersonnes = true;
        this.showDebutContrat = false;
        this.showDateAllerRetourDestination= true;
      } else {
        this.showAssurerTransport = true;
        this.showAssurerPersonnes = true;
        this.showDebutContrat = true;
        this.showDateAllerRetourDestination = false;
      }
    }
  
  onSubmit() {
    console.log(this.myForm.value);
  }
}
