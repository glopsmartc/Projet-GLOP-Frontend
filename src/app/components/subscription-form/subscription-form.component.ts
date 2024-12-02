import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription-form',
  templateUrl: './subscription-form.component.html',
  styleUrls: ['./subscription-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class SubscriptionFormComponent implements OnInit {
  myForm: FormGroup;
  countries: string[] = []; // Liste de pays pour le champ destination

  showAssurerTransport = false;
  showAssurerPersonnes = false;
  showDebutContrat = false;
  showDateAllerRetourDestination = false;

  minDate: string;
  minDateRetour: string;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.myForm = this.fb.group({
      assurerTransport: [false],
      voiture: [false],
      trotinette: [false],
      bicyclette: [false],
      assurerPersonnes: [false],
      nombrePersonnes: ['', [Validators.max(10)]],
      dureeContrat: ['', Validators.required],
      debutContrat: ['', Validators.required],
      dateAller: [''],
      dateRetour: [''],
      destination: [''],
    });


    // Get today's date
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
    this.minDateRetour = this.minDate; // Set initial Date Retour to today's date

    // Écoute les changements sur "dureeContrat"
    this.myForm.get('dureeContrat')?.valueChanges.subscribe(value => {
      this.updateCheckboxVisibility(value);
    });
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
      this.showDateAllerRetourDestination = true;
    } else {
      this.showAssurerTransport = true;
      this.showAssurerPersonnes = true;
      this.showDebutContrat = true;
      this.showDateAllerRetourDestination = false;
    }
  }

  ngOnInit(): void {  
    //max 10 personnes accompagnante
    this.myForm.get('nombrePersonnes')?.valueChanges.subscribe((value) => {
      if (value > 10) {
        this.myForm.get('nombrePersonnes')?.setValue(10, { emitEvent: false });
      }
    });

    // Listen for changes in 'dateAller' and update 'dateRetour' min value.
    this.myForm.get('dateAller')?.valueChanges.subscribe((dateAller: string) => {
      if (dateAller) {
        this.minDateRetour = dateAller; // Update minDateRetour to selected 'dateAller'
      }
    });

    this.loadCountries();//pour charger la liste des pays dès que le composant est initialisé
  }

  onDateAllerChange(event: Event) {
    const selectedDate = (event.target as HTMLInputElement).value;
    this.minDateRetour = selectedDate; // Update 'Date retour' minimum date to 'Date aller'
  }
  

  onNextPage() {
    const formValues = this.myForm.value;
    this.router.navigate(['/subscription-form-second-page'], {
      queryParams: {
        ...formValues,
        nombrePersonnes: formValues.nombrePersonnes,
        assurerTransport: formValues.assurerTransport,
        voiture: formValues.voiture,
        trotinette: formValues.trotinette,
        bicyclette: formValues.bicyclette,
        assurerPersonnes: formValues.assurerPersonnes,
        dureeContrat: formValues.dureeContrat,
        debutContrat: formValues.debutContrat,
        dateAller: formValues.dateAller,
        dateRetour: formValues.dateRetour,
        destination: formValues.destination,
      }
    });
  }
}
