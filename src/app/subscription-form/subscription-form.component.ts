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
    });
  }

  onSubmit() {
    console.log(this.myForm.value);
  }
}
