import { TestBed } from '@angular/core/testing';
import { PartenaireService } from './partenaire.service';
import { AuthService } from './auth.service';
import axios from 'axios';

const mockAuthService = {
  getToken: jasmine.createSpy('getToken').and.returnValue('mock-token')
};

const mockWindowConfig = {
  apiBaseUrlAssistance: 'http://mock-assistance-api.com',
  apiBaseUrl: 'http://mock-base-api.com'
};

const mockAxios = jasmine.createSpyObj('axios', ['get', 'post', 'put', 'delete']);

describe('PartenaireService', () => {
  let service: PartenaireService;
  let originalWindowConfig: any;

  beforeEach(() => {
    originalWindowConfig = (window as any).config;

    Object.defineProperty(window, 'config', {
      get: () => mockWindowConfig,
      configurable: true
    });

    TestBed.configureTestingModule({
      providers: [
        PartenaireService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    spyOn(axios, 'get').and.callFake(mockAxios.get);
    spyOn(axios, 'post').and.callFake(mockAxios.post);
    spyOn(axios, 'put').and.callFake(mockAxios.put);
    spyOn(axios, 'delete').and.callFake(mockAxios.delete);

    service = TestBed.inject(PartenaireService);
    spyOn(console, 'log');
    spyOn(console, 'error'); 
    spyOn(console, 'warn'); 
  });

  afterEach(() => {
    Object.defineProperty(window, 'config', {
      value: originalWindowConfig,
      writable: true,
      configurable: true
    });

    mockAxios.get.calls.reset();
    mockAxios.post.calls.reset();
    mockAxios.put.calls.reset();
    mockAxios.delete.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return correct sous-partenaires API URL from window.config', () => {
    const apiUrl = (service as any).getApiUrl();
    expect(apiUrl).toBe('http://mock-assistance-api.com/api/sousPartenaires');
  });

  it('should return empty string and warn if window.config is not available for sous-partenaires API', () => {
    Object.defineProperty(window, 'config', { get: () => undefined, configurable: true });
    const apiUrl = (service as any).getApiUrl();
    expect(apiUrl).toBe('');
    expect(console.warn).toHaveBeenCalledWith('window.config is not available or window is undefined');
  });

  it('should return correct partenaires API URL from window.config', () => {
    const apiUrlPartenaires = (service as any).getApiUrlPartenaires();
    expect(apiUrlPartenaires).toBe('http://mock-base-api.com/partenaires');
  });

  it('should return empty string and warn if window.config is not available for partenaires API', () => {
    Object.defineProperty(window, 'config', { get: () => undefined, configurable: true });
    const apiUrlPartenaires = (service as any).getApiUrlPartenaires();
    expect(apiUrlPartenaires).toBe('');
    expect(console.warn).toHaveBeenCalledWith('window.config is not available or window is undefined');
  });

  it('should return headers with authorization token', () => {
    const headers = (service as any).getAuthHeaders();
    expect(headers).toEqual({
      Authorization: 'Bearer mock-token'
    });
    expect(mockAuthService.getToken).toHaveBeenCalled();
  });

  it('should fetch all sous-partenaires successfully', async () => {
    mockAxios.get.and.returnValue(Promise.resolve({ data: [{ id: 1, name: 'SousPartenaire1' }] }));
    const result = await service.getAllSousPartenaires();
    expect(mockAxios.get).toHaveBeenCalledWith('http://mock-assistance-api.com/api/sousPartenaires/allSousPartenaires', {
      headers: { Authorization: 'Bearer mock-token' }
    });
    expect(result).toEqual([{ id: 1, name: 'SousPartenaire1' }]);
  });

  it('should throw error on getAllSousPartenaires failure', async () => {
    const error = new Error('Network error');
    mockAxios.get.and.returnValue(Promise.reject(error));
    await expectAsync(service.getAllSousPartenaires()).toBeRejectedWith(error);
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la récupération des sous-partenaires:', error);
  });

  it('should fetch all partenaires successfully', async () => {
    mockAxios.get.and.returnValue(Promise.resolve({ data: [{ id: 2, name: 'Partenaire1' }] }));
    const result = await service.getAllPartenaires();
    expect(mockAxios.get).toHaveBeenCalledWith('http://mock-base-api.com/partenaires/', {
      headers: { Authorization: 'Bearer mock-token' }
    });
    expect(result).toEqual([{ id: 2, name: 'Partenaire1' }]);
  });

  it('should throw error on getAllPartenaires failure', async () => {
    const error = new Error('Network error');
    mockAxios.get.and.returnValue(Promise.reject(error));
    await expectAsync(service.getAllPartenaires()).toBeRejectedWith(error);
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la récupération des partenaires:', error);
  });

  it('should fetch partenaire by id successfully', async () => {
    mockAxios.get.and.returnValue(Promise.resolve({ data: { id: 1, name: 'Partenaire1' } }));
    const result = await service.getPartenaireById(1);
    expect(mockAxios.get).toHaveBeenCalledWith('http://mock-base-api.com/partenaires/1', {
      headers: { Authorization: 'Bearer mock-token' }
    });
    expect(result).toEqual({ id: 1, name: 'Partenaire1' });
  });

  it('should throw error on getPartenaireById failure', async () => {
    const error = new Error('Fetch error');
    mockAxios.get.and.returnValue(Promise.reject(error));
    await expectAsync(service.getPartenaireById(1)).toBeRejectedWith(error);
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la récupération du partenaire:', error);
  });

  it('should delete partenaire successfully', async () => {
    mockAxios.delete.and.returnValue(Promise.resolve({ data: null }));
    await service.deletePartenaire(1);
    expect(mockAxios.delete).toHaveBeenCalledWith('http://mock-assistance-api.com/api/sousPartenaires/deleteSousPartenaire/1', {
      headers: { Authorization: 'Bearer mock-token' }
    });
  });

  it('should throw error on deletePartenaire failure', async () => {
    const error = new Error('Delete error');
    mockAxios.delete.and.returnValue(Promise.reject(error));
    await expectAsync(service.deletePartenaire(1)).toBeRejectedWith(error);
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la suppression du sous-partenaire:', error);
  });

  it('should update partenaire successfully', async () => {
    const partenaireData = { name: 'UpdatedPartenaire' };
    mockAxios.put.and.returnValue(Promise.resolve({ data: null }));
    await service.updatePartenaire(1, partenaireData);
    expect(mockAxios.put).toHaveBeenCalledWith(
      'http://mock-assistance-api.com/api/sousPartenaires/updateSousPartenaire/1',
      partenaireData,
      { headers: { Authorization: 'Bearer mock-token' } }
    );
  });

  it('should throw error on updatePartenaire failure', async () => {
    const partenaireData = { name: 'UpdatedPartenaire' };
    const error = new Error('Update error');
    mockAxios.put.and.returnValue(Promise.reject(error));
    await expectAsync(service.updatePartenaire(1, partenaireData)).toBeRejectedWith(error);
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la modification du sous-partenaire:', error);
  });

  it('should add partenaire successfully', async () => {
    const partenaireData = { name: 'NewPartenaire' };
    mockAxios.post.and.returnValue(Promise.resolve({ data: null }));
    await service.addPartenaire(partenaireData);
    expect(mockAxios.post).toHaveBeenCalledWith(
      'http://mock-assistance-api.com/api/sousPartenaires/createSousPartenaire',
      partenaireData,
      { headers: { Authorization: 'Bearer mock-token' } }
    );
  });

  it('should throw error on addPartenaire failure', async () => {
    const partenaireData = { name: 'NewPartenaire' };
    const error = new Error('Add error');
    mockAxios.post.and.returnValue(Promise.reject(error));
    await expectAsync(service.addPartenaire(partenaireData)).toBeRejectedWith(error);
    expect(console.error).toHaveBeenCalledWith('Erreur lors de l\'ajout du sous-partenaire:', error);
  });
});