import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmissionCo2Service } from './emission-co2.service';
import { AuthService } from './auth.service';

describe('EmissionCo2Service', () => {
  let service: EmissionCo2Service;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  const mockAuthService = {
    getToken: jasmine.createSpy().and.returnValue('mock-token')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EmissionCo2Service,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(EmissionCo2Service);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  describe('getVehicleMakes', () => {
    it('should make a GET request to fetch vehicle makes', () => {
      const mockResponse = { makes: ['Toyota', 'Ford'] };

      service.getVehicleMakes().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(req => req.method === 'GET' && req.url.includes('/vehicle_makes'));
      expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
      req.flush(mockResponse);
    });
  });

  describe('getVehicleModels', () => {
    it('should make a GET request to fetch vehicle models for a specific make', () => {
      const make = 'Toyota';
      const mockResponse = { models: ['Corolla', 'Camry'] };

      service.getVehicleModels(make).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(req => req.method === 'GET' && req.url.includes(`/vehicle_makes/${make}/vehicle_models`));
      expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
      req.flush(mockResponse);
    });
  });

  describe('estimateVehicleEmissions', () => {
    it('should make a POST request to estimate vehicle emissions', () => {
      const make = 'Toyota';
      const model = 'Corolla';
      const distance = 100;
      const mockResponse = { emissions: 50 };

      service.estimateVehicleEmissions(make, model, distance).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(req => req.method === 'POST' && req.url.includes('/vehicle_estimate_by_model'));
      expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
      req.flush(mockResponse);
    });
  });
});
