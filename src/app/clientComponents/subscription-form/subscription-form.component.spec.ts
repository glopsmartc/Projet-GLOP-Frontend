import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubscriptionFormComponent } from './subscription-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

describe('SubscriptionFormComponent', () => {
  let component: SubscriptionFormComponent;
  let fixture: ComponentFixture<SubscriptionFormComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, SubscriptionFormComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.myForm.value).toEqual({
      assurerTransport: false,
      voiture: false,
      trotinette: false,
      bicyclette: false,
      assurerPersonnes: false,
      nombrePersonnes: '',
      dureeContrat: '',
      debutContrat: '',
      dateAller: '',
      dateRetour: '',
      destination: ''
    });
  });

  it('should mark form as invalid if required fields are empty', () => {
    component.onNextPage();
    expect(component.myForm.invalid).toBeTrue();
  });

  it('should navigate to next page when form is valid', () => {
    component.myForm.setValue({
      assurerTransport: true,
      voiture: true,
      trotinette: false,
      bicyclette: false,
      assurerPersonnes: true,
      nombrePersonnes: 2,
      dureeContrat: '1_voyage',
      debutContrat: '',
      dateAller: '2025-02-20',
      dateRetour: '2025-02-25',
      destination: 'France'
    });
    component.onNextPage();
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should validate transport selection when assurerTransport is checked', () => {
    component.myForm.get('assurerTransport')?.setValue(true);
    component.myForm.get('voiture')?.setValue(false);
    component.myForm.get('trotinette')?.setValue(false);
    component.myForm.get('bicyclette')?.setValue(false);
    expect(component.myForm.errors).toEqual({ transportRequired: true });
  });
});
