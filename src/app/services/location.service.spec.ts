import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LocationService } from './location.service';
import { HttpClient } from '@angular/common/http';

const mockGeolocation = {
  getCurrentPosition: jasmine.createSpy('getCurrentPosition')
};

describe('LocationService', () => {
  let service: LocationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    Object.defineProperty(navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
      configurable: true
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LocationService]
    });

    service = TestBed.inject(LocationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    mockGeolocation.getCurrentPosition.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return current location with address on success', async () => {
    const mockPosition = {
      coords: { latitude: 48.8566, longitude: 2.3522 }
    };
    const mockAddress = 'Paris, France';

    mockGeolocation.getCurrentPosition.and.callFake((success: Function) => {
      success(mockPosition);
    });

    const promise = service.getCurrentLocation();

    const req = httpMock.expectOne('https://nominatim.openstreetmap.org/reverse?format=json&lat=48.8566&lon=2.3522');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('User-Agent')).toBe('YourAppName');
    req.flush({ display_name: mockAddress });

    const result = await promise;
    expect(result).toEqual({
      latitude: 48.8566,
      longitude: 2.3522,
      address: mockAddress
    });
  });

  it('should return coordinates as address if reverse geocoding fails', async () => {
    const mockPosition = {
      coords: { latitude: 48.8566, longitude: 2.3522 }
    };

    mockGeolocation.getCurrentPosition.and.callFake((success: Function) => {
      success(mockPosition);
    });

    const promise = service.getCurrentLocation();

    const req = httpMock.expectOne('https://nominatim.openstreetmap.org/reverse?format=json&lat=48.8566&lon=2.3522');
    req.error(new ErrorEvent('Network error'));

    const result = await promise;
    expect(result).toEqual({
      latitude: 48.8566,
      longitude: 2.3522,
      address: '48.8566, 2.3522'
    });
  });

  it('should reject with error if geolocation is not supported', async () => {
    Object.defineProperty(navigator, 'geolocation', { value: undefined, configurable: true });

    await expectAsync(service.getCurrentLocation()).toBeRejectedWith(
      new Error('Géolocalisation non supportée')
    );
  });


  it('should return address from reverse geocoding', async () => {
    const result = service['reverseGeocode'](48.8566, 2.3522); 

    const req = httpMock.expectOne('https://nominatim.openstreetmap.org/reverse?format=json&lat=48.8566&lon=2.3522');
    expect(req.request.method).toBe('GET');
    req.flush({ display_name: 'Paris, France' });

    expect(await result).toBe('Paris, France');
  });

  it('should return coordinates if reverse geocoding fails', async () => {
    const result = service['reverseGeocode'](48.8566, 2.3522);

    const req = httpMock.expectOne('https://nominatim.openstreetmap.org/reverse?format=json&lat=48.8566&lon=2.3522');
    req.error(new ErrorEvent('Network error'));

    expect(await result).toBe('48.8566, 2.3522');
  });

  it('should return generic error message for unknown error', () => {
    const error = { code: 999, message: 'Unknown' } as GeolocationPositionError;
    const message = (service as any).getErrorMessage(error);
    expect(message).toBe('Erreur de localisation');
  });
});