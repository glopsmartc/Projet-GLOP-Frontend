import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculateEmissionComponent } from './calculate-emission.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmissionCo2Service } from '../../services/emission-co2.service';
import { of, throwError } from 'rxjs';

describe('CalculateEmissionComponent', () => {
  let component: CalculateEmissionComponent;
  let fixture: ComponentFixture<CalculateEmissionComponent>;
  let emissionCo2Service: jasmine.SpyObj<EmissionCo2Service>;

  beforeEach(async () => {
    const emissionCo2ServiceSpy = jasmine.createSpyObj('EmissionCo2Service', [
      'getVehicleMakes',
      'getVehicleModels',
      'estimateVehicleEmissions',
      'calculateEmissions',
    ]);

    await TestBed.configureTestingModule({
      imports: [CalculateEmissionComponent, HttpClientTestingModule, FormsModule, CommonModule],
      providers: [
        { provide: EmissionCo2Service, useValue: emissionCo2ServiceSpy },
      ],
    }).compileComponents();

    emissionCo2Service = TestBed.inject(EmissionCo2Service) as jasmine.SpyObj<EmissionCo2Service>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculateEmissionComponent);
    component = fixture.componentInstance;

    emissionCo2Service.getVehicleMakes.and.returnValue(of({ data: [] }));
    emissionCo2Service.getVehicleModels.and.returnValue(of({ data: [] }));
    emissionCo2Service.estimateVehicleEmissions.and.returnValue(of({ data: { co2e_kg: 0 } }));
    emissionCo2Service.calculateEmissions.and.returnValue(of({ data: [] }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty vehicle makes and models', () => {
    expect(component.vehicleMakes).toEqual([]);
    expect(component.vehicleModels).toEqual([]);
  });

  it('should load vehicle makes on ngOnInit', () => {
    const mockMakes = [{ make: 'Toyota' }, { make: 'Honda' }];
    emissionCo2Service.getVehicleMakes.and.returnValue(of({ data: mockMakes }));

    component.ngOnInit();
    fixture.detectChanges();

    expect(emissionCo2Service.getVehicleMakes).toHaveBeenCalled();
    expect(component.vehicleMakes).toEqual(['Toyota', 'Honda']);
  });

  it('should handle error when loading vehicle makes', () => {
    emissionCo2Service.getVehicleMakes.and.returnValue(throwError('Error loading makes'));

    component.ngOnInit();
    fixture.detectChanges();

    expect(emissionCo2Service.getVehicleMakes).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Erreur lors du chargement des marques de véhicules.');
  });

  it('should load vehicle models when a make is selected', () => {
    const mockModels = [{ model: 'Corolla' }, { model: 'Camry' }];
    emissionCo2Service.getVehicleModels.and.returnValue(of({ data: mockModels }));

    component.onMakeSelected('Toyota');
    fixture.detectChanges();

    expect(emissionCo2Service.getVehicleModels).toHaveBeenCalledWith('Toyota');
    expect(component.vehicleModels).toEqual(['Corolla', 'Camry']);
  });

  it('should handle error when loading vehicle models', () => {
    emissionCo2Service.getVehicleModels.and.returnValue(throwError('Error loading models'));

    component.onMakeSelected('Toyota');
    fixture.detectChanges();

    expect(emissionCo2Service.getVehicleModels).toHaveBeenCalledWith('Toyota');
    expect(component.errorMessage).toBe('Erreur lors du chargement des modèles de véhicules.');
  });

  it('should calculate emissions for a vehicle', () => {
    const mockResponse = { data: { co2e_kg: 100 } };
    emissionCo2Service.estimateVehicleEmissions.and.returnValue(of(mockResponse));

    component.selectedTransport = 'voiture';
    component.vehicleMake = 'Toyota';
    component.vehicleModel = 'Corolla';
    component.km = 100;

    component.calculateEmissions();
    fixture.detectChanges();

    expect(emissionCo2Service.estimateVehicleEmissions).toHaveBeenCalledWith('Toyota', 'Corolla', 100);
    expect(component.emissions).toEqual([{ name: 'Toyota Corolla', value: 100 }]);
    expect(component.errorMessage).toBe('');
  });

  it('should handle error when calculating emissions for a vehicle', () => {
    emissionCo2Service.estimateVehicleEmissions.and.returnValue(throwError('Error calculating emissions'));

    component.selectedTransport = 'voiture';
    component.vehicleMake = 'Toyota';
    component.vehicleModel = 'Corolla';
    component.km = 100;

    component.calculateEmissions();
    fixture.detectChanges();

    expect(emissionCo2Service.estimateVehicleEmissions).toHaveBeenCalledWith('Toyota', 'Corolla', 100);
    expect(component.errorMessage).toBe('Erreur lors de la récupération des données.');
  });

  it('should calculate emissions for other transports', () => {
    const mockResponse = { data: [{ name: 'Bus', value: 50 }] };
    emissionCo2Service.calculateEmissions.and.returnValue(of(mockResponse));

    component.selectedTransport = '6';
    component.km = 100;

    component.calculateEmissions();
    fixture.detectChanges();

    expect(emissionCo2Service.calculateEmissions).toHaveBeenCalledWith(100, 6);
    expect(component.emissions).toEqual([{ name: 'Bus', value: 50 }]);
    expect(component.errorMessage).toBe('');
  });

  it('should handle error when calculating emissions for other transports', () => {
    emissionCo2Service.calculateEmissions.and.returnValue(throwError('Error calculating emissions'));

    component.selectedTransport = '6';
    component.km = 100;

    component.calculateEmissions();
    fixture.detectChanges();

    expect(emissionCo2Service.calculateEmissions).toHaveBeenCalledWith(100, 6);
    expect(component.errorMessage).toBe('Erreur lors de la récupération des données.');
  });
});
