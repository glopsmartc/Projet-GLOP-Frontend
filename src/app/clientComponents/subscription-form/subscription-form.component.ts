import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors  } from '@angular/forms';
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
  maxDateAller: string;

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
      dateAller:['', Validators.required],
      dateRetour: ['', Validators.required],
      destination: ['', Validators.required],
    }, {
      validators: Validators.compose([
        this.transportSelectionValidator,
      ])
    });

    // Get today's date
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
    this.minDateRetour = this.minDate; // Set initial Date Retour to today's date
    this.maxDateAller = '';

    //ecoute les changements sur dureeContrat
    this.myForm.get('dureeContrat')?.valueChanges.subscribe(value => {
      this.updateCheckboxVisibility(value);
    });

    //validateur conditionnel pour le champ 'nombrePersonnes'
    this.myForm.get('assurerPersonnes')?.valueChanges.subscribe((isAssurerPersonnes) => {
      const nombrePersonnesControl = this.myForm.get('nombrePersonnes');
      if (isAssurerPersonnes) {
        nombrePersonnesControl?.setValidators([Validators.required, Validators.min(1)]);
      } else {
        nombrePersonnesControl?.clearValidators();
      }
      nombrePersonnesControl?.updateValueAndValidity();
    });
  }//fin constructeur

  //validateur pour vérifier qu'au moins un moyen de transport est sélectionné
  transportSelectionValidator(control: AbstractControl): ValidationErrors | null {
    const form = control as FormGroup;
    const isAssurerTransport = form.get('assurerTransport')?.value;
    const isVoitureSelected = form.get('voiture')?.value;
    const isTrotinetteSelected = form.get('trotinette')?.value;
    const isBicycletteSelected = form.get('bicyclette')?.value;

    if (isAssurerTransport && !isVoitureSelected && !isTrotinetteSelected && !isBicycletteSelected) {
      return { transportRequired: true };
    }
    return null; // Pas d'erreur
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
      //supprime le validateur pour debutContrat
      this.myForm.get('debutContrat')?.clearValidators(); //////////////////////////////////////bech taml kifha ll lokhra eli mach tet3ada ken bel kol
      this.myForm.get('debutContrat')?.updateValueAndValidity();
      //ajoute le validateur pour dateAller/ dateRetour/ destination
      this.myForm.get('dateAller')?.setValidators(Validators.required);
      this.myForm.get('dateAller')?.updateValueAndValidity();
      this.myForm.get('dateRetour')?.setValidators(Validators.required);
      this.myForm.get('dateRetour')?.updateValueAndValidity();
      this.myForm.get('destination')?.setValidators(Validators.required);
      this.myForm.get('destination')?.updateValueAndValidity();
    } else {
      this.showAssurerTransport = true;
      this.showAssurerPersonnes = true;
      this.showDebutContrat = true;
      this.showDateAllerRetourDestination = false;
      //ajoute le validateur pour debutContrat
      this.myForm.get('debutContrat')?.setValidators(Validators.required);
      this.myForm.get('debutContrat')?.updateValueAndValidity();
      //supprime le validateur pour dateAller/ dateRetour/ destination
      this.myForm.get('dateAller')?.clearValidators();
      this.myForm.get('dateAller')?.updateValueAndValidity();
      this.myForm.get('dateRetour')?.clearValidators();
      this.myForm.get('dateRetour')?.updateValueAndValidity();
      this.myForm.get('destination')?.clearValidators();
      this.myForm.get('destination')?.updateValueAndValidity();
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

    //ecoute les changements de dateRetour et update dateAller comme max value.
    this.myForm.get('dateRetour')?.valueChanges.subscribe((dateRetour: string) => {
      if (dateRetour) {
        this.maxDateAller = dateRetour; // Update maxDateAller to selected 'dateRetour'
      }
    });

    this.loadCountries();//pour charger la liste des pays dès que le composant est initialisé
  }

  onDateRetourChange(event: Event) {
    const selectedDate = (event.target as HTMLInputElement).value;
    this.maxDateAller = selectedDate; // Update 'Date aller' maximum date to 'Date retour'
    //console.log("Date Retour modifiée:", selectedDate, "Max Date Aller:", this.maxDateAller);
  }

  onDateAllerChange(event: Event) {
    const selectedDate = (event.target as HTMLInputElement).value;
    this.minDateRetour = selectedDate; // Update 'Date retour' minimum date to 'Date aller'
  }

  formSubmitted = false;

  onNextPage() {
    this.formSubmitted = true;
    //console.log(this.myForm.get('nombrePersonnes')?.errors);
    if (this.myForm.invalid) {
      //marque tous les champs comme touchés pour déclencher les validations
      this.myForm.markAllAsTouched();
      return; //pas de soumission si l'un des champ n'est pas valide
    }
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