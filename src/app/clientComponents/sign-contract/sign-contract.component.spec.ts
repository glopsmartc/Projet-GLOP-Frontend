import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignContractComponent } from './sign-contract.component';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ContratService } from '../../services/contrat.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PaymentDialogComponent } from '../../modalDialogs/payment-dialog/payment-dialog.component';
import { ReforestationDialogComponent } from '../../modalDialogs/reforestation-dialog/reforestation-dialog.component';
import { ConditionsDialogComponent } from './sign-contract.component';

describe('SignContractComponent', () => {
  let component: SignContractComponent;
  let fixture: ComponentFixture<SignContractComponent>;
  let router: Router;
  let dialog: MatDialog;
  let activatedRoute: ActivatedRoute;
  let contratService: ContratService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, MatDialogModule, FormsModule, SignContractComponent],
      providers: [
        { provide: Router, useValue: { navigate: () => {} } },
        { provide: MatDialog, useValue: { open: () => {} } },
        { provide: ActivatedRoute, useValue: { paramMap: of({}) } },
        { provide: ContratService, useValue: { getCurrentUser: () => Promise.resolve({ prenom: 'John', nom: 'Doe' }) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignContractComponent);
    component = fixture.componentInstance;

    component.selectedPlan = { name: 'Plan A', price: '100 €', description: 'Description A' };
    component.formData = { dureeContrat: '1 an', debutContrat: '2023-01-01' };

    router = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog);
    activatedRoute = TestBed.inject(ActivatedRoute);
    contratService = TestBed.inject(ContratService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should handle error when getting current user', async () => {
    spyOn(contratService, 'getCurrentUser').and.returnValue(Promise.reject('Error'));
    spyOn(console, 'error');
    await component.ngOnInit();
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la récupération de l\'utilisateur actuel:', 'Error');
  });

  it('should set selectedPlan and formData from state', () => {
    const mockState = {
      selectedPlan: { name: 'Plan A', price: '100 €', description: 'Description A' },
      formData: { dureeContrat: '1 an', debutContrat: '2023-01-01' }
    };
    spyOn(history, 'state').and.returnValue(mockState);
    component.ngOnInit();
    expect(component.selectedPlan).toEqual(mockState.selectedPlan);
    expect(component.formData).toEqual(mockState.formData);
  });

  it('should navigate to error page if state is not available', () => {
    spyOn(history, 'state').and.returnValue(null);
    spyOn(router, 'navigate');
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/error-page']);
  });


  it('should update finalPrice when carbonOffset is false', () => {
    component.selectedPlan = { price: '100 €' };
    component.carbonOffset = false;
    component.updatePrice();
    expect(component.finalPrice).toBe(100);
  });


});
