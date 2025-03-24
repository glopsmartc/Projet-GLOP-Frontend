import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SubscriptionFormSecondPageComponent } from './subscription-form-second-page.component';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContratService } from '../../services/contrat.service';
import { EmissionCo2Service } from '../../services/emission-co2.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { ReforestationDialogComponent } from '../../modalDialogs/reforestation-dialog/reforestation-dialog.component';

const mockActivatedRoute = {
  queryParams: of({
    nombrePersonnes: '2',
    assurerTransport: 'oui',
    voiture: 'oui',
    dureeContrat: '1_mois'
  })
};

const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

const mockContratService = {
  getOffreCorrespondante: jasmine.createSpy('getOffreCorrespondante').and.returnValue(Promise.resolve({ id: 1, nom: 'Offre A' }))
};

const mockEmissionCo2Service = {
  getVehicleMakes: jasmine.createSpy('getVehicleMakes').and.returnValue(of({ data: [{ make: 'Toyota' }, { make: 'Honda' }] })),
  getVehicleModels: jasmine.createSpy('getVehicleModels').and.returnValue(of({ data: [{ model: 'Corolla' }, { model: 'Civic' }] })),
  estimateVehicleEmissions: jasmine.createSpy('estimateVehicleEmissions').and.returnValue(of({ data: { co2e_kg: 50 } })),
  calculateEmissions: jasmine.createSpy('calculateEmissions').and.returnValue(of({ data: [{ name: 'TGV', value: 10 }] }))
};

const mockMatDialog = {
  open: jasmine.createSpy('open').and.returnValue({ afterClosed: () => of(true) })
};

describe('SubscriptionFormSecondPageComponent', () => {
  let component: SubscriptionFormSecondPageComponent;
  let fixture: ComponentFixture<SubscriptionFormSecondPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SubscriptionFormSecondPageComponent,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule
      ],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: ContratService, useValue: mockContratService },
        { provide: EmissionCo2Service, useValue: mockEmissionCo2Service },
        { provide: MatDialog, useValue: mockMatDialog }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionFormSecondPageComponent);
    component = fixture.componentInstance;
    spyOn(console, 'log');
    spyOn(console, 'error'); 
    spyOn(console, 'warn'); 
    spyOn(localStorage, 'setItem'); 
    spyOn(localStorage, 'removeItem'); 
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with query params and load vehicle makes', () => {
    component.ngOnInit();
    expect(component.nombrePersonnes).toBe(2);
    expect(component.accompagnants.length).toBe(2);
    expect(component.dureeContrat).toBe('1_mois');
    expect(component.labelDistance).toBe('Distance parcourue approximative en 1 mois (km)');
    expect(component.vehicleMakes).toEqual(['Toyota', 'Honda']);
    expect(localStorage.removeItem).toHaveBeenCalledWith('carbonEmissions');
  });


  it('should load vehicle makes', () => {
    component.loadVehicleMakes();
    expect(component.vehicleMakes).toEqual(['Toyota', 'Honda']);
    expect(component.errorMessage).toBe('');
  });

  it('should load vehicle models when make is selected', () => {
    component.onMakeSelected('Toyota');
    expect(mockEmissionCo2Service.getVehicleModels).toHaveBeenCalledWith('Toyota');
    expect(component.vehicleModels).toEqual(['Corolla', 'Civic']);
    expect(component.errorMessage).toBe('');
  });

  it('should calculate emissions for vehicle', () => {
    component.selectedTransport = 'voiture';
    component.vehicleMake = 'Toyota';
    component.vehicleModel = 'Corolla';
    component.km = 100;
    component.calculateEmissions();
    expect(mockEmissionCo2Service.estimateVehicleEmissions).toHaveBeenCalledWith('Toyota', 'Corolla', 100);
    expect(component.emissions).toEqual([{ name: 'Toyota Corolla', value: 50 }]);
    expect(component.errorMessage).toBe('');
  });

  it('should calculate emissions for other transport', () => {
    component.selectedTransport = '2'; 
    component.km = 200;
    component.calculateEmissions();
    expect(mockEmissionCo2Service.calculateEmissions).toHaveBeenCalledWith(200, 2);
    expect(component.emissions).toEqual([{ name: 'TGV', value: 10 }]);
    expect(component.errorMessage).toBe('');
  });

  it('should open reforestation dialog', () => {
    component.openReforestationDialog();
    expect(mockMatDialog.open).toHaveBeenCalledWith(ReforestationDialogComponent, {
      width: '80%',
      height: '60%'
    });
  });

  it('should save carbon offset preference and emissions', () => {
    component.carbonOffset = true;
    component.emissions = [{ name: 'TGV', value: 10 }];
    component.saveCarbonOffsetPreference();
    expect(localStorage.setItem).toHaveBeenCalledWith('carbonOffset', 'true');
    expect(localStorage.setItem).toHaveBeenCalledWith('carbonEmissions', JSON.stringify([10]));
  });

  it('should enable elements on recalculate', () => {
    component.isDisabled = true;
    component.recalculate();
    expect(component.isDisabled).toBeFalse();
  });

  it('should disable elements on transport change', () => {
    component.isDisabled = false;
    component.onTransportChange();
    expect(component.isDisabled).toBeTrue();
  });

  
});