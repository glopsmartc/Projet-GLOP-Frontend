import { TestBed } from '@angular/core/testing';
import { ContratService } from './contrat.service';
import { AuthService } from './auth.service';
import axios from 'axios';

const mockAuthService = {
  getToken: jasmine.createSpy('getToken').and.returnValue('mock-token')
};

const mockWindowConfig = {
  apiBaseUrlContrat: 'http://mock-contrat-api.com',
  apiBaseUrl: 'http://mock-user-api.com'
};

const mockAxios = jasmine.createSpyObj('axios', ['get', 'post', 'patch']);

describe('ContratService', () => {
  let service: ContratService;
  let originalWindowConfig: any;

  beforeEach(() => {
    originalWindowConfig = (window as any).config;

    Object.defineProperty(window, 'config', {
      get: () => mockWindowConfig,
      configurable: true
    });

    TestBed.configureTestingModule({
      providers: [
        ContratService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    spyOn(axios, 'get').and.callFake(mockAxios.get);
    spyOn(axios, 'post').and.callFake(mockAxios.post);
    spyOn(axios, 'patch').and.callFake(mockAxios.patch);

    service = TestBed.inject(ContratService);
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
    mockAxios.patch.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return correct contrat API URL from window.config', () => {
    const apiUrl = (service as any).getApiUrl();
    expect(apiUrl).toBe('http://mock-contrat-api.com/api/contrat');
  });

  it('should return empty string and warn if window.config is not available for contrat API', () => {
    Object.defineProperty(window, 'config', { get: () => undefined, configurable: true });
    const apiUrl = (service as any).getApiUrl();
    expect(apiUrl).toBe('');
    expect(console.warn).toHaveBeenCalledWith('window.config is not available or window is undefined');
  });

  it('should return correct utilisateur API URL from window.config', () => {
    const apiUrlUtilisateur = (service as any).getApiUrlUtilisateur();
    expect(apiUrlUtilisateur).toBe('http://mock-user-api.com/clients');
  });

  it('should return empty string and warn if window.config is not available for utilisateur API', () => {
    Object.defineProperty(window, 'config', { get: () => undefined, configurable: true });
    const apiUrlUtilisateur = (service as any).getApiUrlUtilisateur();
    expect(apiUrlUtilisateur).toBe('');
    expect(console.warn).toHaveBeenCalledWith('window.config is not available or window is undefined');
  });

  it('should return headers with authorization token', () => {
    const headers = (service as any).getAuthHeaders();
    expect(headers).toEqual({
      headers: {
        Authorization: 'Bearer mock-token'
      }
    });
    expect(mockAuthService.getToken).toHaveBeenCalled();
  });

  it('should fetch user contracts successfully', async () => {
    mockAxios.get.and.returnValue(Promise.resolve({ data: [{ id: 1, name: 'Contrat1' }] }));
    const result = await service.getUserContracts();
    expect(mockAxios.get).toHaveBeenCalledWith('http://mock-contrat-api.com/api/contrat/user-contracts', {
      headers: { Authorization: 'Bearer mock-token' }
    });
    expect(result).toEqual([{ id: 1, name: 'Contrat1' }]);
    expect(console.log).toHaveBeenCalledWith('API Response:', [{ id: 1, name: 'Contrat1' }]);
  });

  it('should throw error on getUserContracts failure', async () => {
    const error = new Error('Network error');
    mockAxios.get.and.returnValue(Promise.reject(error));
    await expectAsync(service.getUserContracts()).toBeRejectedWith(error);
    expect(console.error).toHaveBeenCalledWith('Error fetching contracts:', error);
  });

  it('should fetch corresponding offer successfully', async () => {
    const request = { type: 'test' };
    mockAxios.post.and.returnValue(Promise.resolve({ data: { id: 1, offre: 'Offre1' } }));
    const result = await service.getOffreCorrespondante(request);
    expect(mockAxios.post).toHaveBeenCalledWith(
      'http://mock-contrat-api.com/api/contrat/getOffre',
      request,
      { headers: { Authorization: 'Bearer mock-token' } }
    );
    expect(result).toEqual({ id: 1, offre: 'Offre1' });
    expect(console.log).toHaveBeenCalledWith('Réponse des offres correspondantes (POST):', jasmine.any(Object));
  });

  it('should throw error on getOffreCorrespondante failure', async () => {
    const request = { type: 'test' };
    const error = new Error('Fetch error');
    mockAxios.post.and.returnValue(Promise.reject(error));
    await expectAsync(service.getOffreCorrespondante(request)).toBeRejectedWith(error);
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la récupération des offres (POST):', error);
  });

  it('should create contract with file successfully', async () => {
    const request = { type: 'test' };
    const pdfFile = new File([''], 'test.pdf');
    mockAxios.post.and.returnValue(Promise.resolve({ data: { id: 2 } }));
    const result = await service.createContract(request, pdfFile);
    expect(mockAxios.post).toHaveBeenCalledWith(
      'http://mock-contrat-api.com/api/contrat/create',
      jasmine.any(FormData),
      { headers: { Authorization: 'Bearer mock-token', Accept: 'application/json' } }
    );
    expect(result).toEqual({ id: 2 });
    expect(console.log).toHaveBeenCalledWith('Réponse du backend (contrat créé avec offre) :', { id: 2 });
  });

  it('should throw error on createContract failure', async () => {
    const request = { type: 'test' };
    const pdfFile = new File([''], 'test.pdf');
    const error = new Error('Upload error');
    mockAxios.post.and.returnValue(Promise.reject(error));
    await expectAsync(service.createContract(request, pdfFile)).toBeRejectedWith(error);
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la création du contrat ou de l\'upload du fichier :', error);
  });

  it('should fetch current user email successfully', async () => {
    mockAxios.get.and.returnValue(Promise.resolve({ data: { email: 'user@example.com' } }));
    const result = await service.getCurrentUserEmail();
    expect(mockAxios.get).toHaveBeenCalledWith('http://mock-contrat-api.com/api/contrat/current-user', {
      headers: { Authorization: 'Bearer mock-token' }
    });
    expect(result).toBe('user@example.com');
  });

  it('should throw error on getCurrentUserEmail failure', async () => {
    const error = new Error('Fetch error');
    mockAxios.get.and.returnValue(Promise.reject(error));
    await expectAsync(service.getCurrentUserEmail()).toBeRejectedWith(error);
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la récupération de l\'utilisateur actuel:', error);
  });

  it('should fetch all offers successfully', async () => {
    mockAxios.get.and.returnValue(Promise.resolve({ data: [{ id: 1, name: 'Offre1' }] }));
    const result = await service.getAllOffres();
    expect(mockAxios.get).toHaveBeenCalledWith('http://mock-contrat-api.com/api/contrat/allOffers', {
      headers: { Authorization: 'Bearer mock-token' }
    });
    expect(result).toEqual([{ id: 1, name: 'Offre1' }]);
    expect(console.log).toHaveBeenCalledWith('Réponse des offres disponibles :', [{ id: 1, name: 'Offre1' }]);
  });

  it('should throw error on getAllOffres failure', async () => {
    const error = new Error('Fetch error');
    mockAxios.get.and.returnValue(Promise.reject(error));
    await expectAsync(service.getAllOffres()).toBeRejectedWith(error);
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la récupération des offres :', error);
  });

  it('should fetch contract by id successfully', async () => {
    mockAxios.get.and.returnValue(Promise.resolve({ data: { id: 1, name: 'Contrat1' } }));
    const result = await service.getContratById(1);
    expect(mockAxios.get).toHaveBeenCalledWith('http://mock-contrat-api.com/api/contrat/1', {
      headers: { Authorization: 'Bearer mock-token' }
    });
    expect(result).toEqual({ id: 1, name: 'Contrat1' });
    expect(console.log).toHaveBeenCalledWith('Réponse du contrat récupéré :', { id: 1, name: 'Contrat1' });
  });

  it('should throw error on getContratById failure', async () => {
    const error = new Error('Fetch error');
    mockAxios.get.and.returnValue(Promise.reject(error));
    await expectAsync(service.getContratById(1)).toBeRejectedWith(error);
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la récupération du contrat avec l\'ID 1 :', error);
  });

  it('should fetch all contracts successfully', async () => {
    mockAxios.get.and.returnValue(Promise.resolve({ data: [{ id: 1, name: 'Contrat1' }] }));
    const result = await service.getAllContrats();
    expect(mockAxios.get).toHaveBeenCalledWith('http://mock-contrat-api.com/api/contrat', {
      headers: { Authorization: 'Bearer mock-token' }
    });
    expect(result).toEqual([{ id: 1, name: 'Contrat1' }]);
    expect(console.log).toHaveBeenCalledWith('Réponse des contrats disponibles :', [{ id: 1, name: 'Contrat1' }]);
  });

  it('should throw error on getAllContrats failure', async () => {
    const error = new Error('Fetch error');
    mockAxios.get.and.returnValue(Promise.reject(error));
    await expectAsync(service.getAllContrats()).toBeRejectedWith(error);
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la récupération des contrats :', error);
  });

  it('should fetch all contracts for conseiller successfully', async () => {
    mockAxios.get.and.returnValue(Promise.resolve({ data: [{ id: 1, name: 'Contrat1' }] }));
    const result = await service.getAllContratsFroConseiller();
    expect(mockAxios.get).toHaveBeenCalledWith('http://mock-contrat-api.com/api/contrat/', {
      headers: { Authorization: 'Bearer mock-token' }
    });
    expect(result).toEqual([{ id: 1, name: 'Contrat1' }]);
    expect(console.log).toHaveBeenCalledWith('Réponse des contrats disponibles :', [{ id: 1, name: 'Contrat1' }]);
  });

  it('should fetch current user successfully', async () => {
    mockAxios.get.and.returnValue(Promise.resolve({ data: { email: 'user@example.com', nom: 'Doe', prenom: 'John' } }));
    const result = await service.getCurrentUser();
    expect(mockAxios.get).toHaveBeenCalledWith('http://mock-contrat-api.com/api/contrat/current-user', {
      headers: { Authorization: 'Bearer mock-token' }
    });
    expect(result).toEqual({ email: 'user@example.com', nom: 'Doe', prenom: 'John' });
  });

  it('should cancel contract successfully', async () => {
    mockAxios.patch.and.returnValue(Promise.resolve({ data: { success: true } }));
    await service.resilierContrat(1);
    expect(mockAxios.patch).toHaveBeenCalledWith(
      'http://mock-contrat-api.com/api/contrat/1/resilier',
      {},
      { headers: { Authorization: 'Bearer mock-token' } }
    );
    expect(console.log).toHaveBeenCalledWith('Contrat résilié avec succès:', { success: true });
  });

  it('should throw error on resilierContrat failure', async () => {
    const error = { response: { status: 400, data: 'Bad request' } };
    mockAxios.patch.and.returnValue(Promise.reject(error));
    await expectAsync(service.resilierContrat(1)).toBeRejectedWith(error);
    expect(console.error).toHaveBeenCalledWith('Erreur de l’API:', 400, 'Bad request');
  });

  it('should download contract file successfully', async () => {
    const blob = new Blob(['test']);
    mockAxios.get.and.returnValue(Promise.resolve({ data: blob }));
    const result = await service.downloadContractFile('1');
    expect(mockAxios.get).toHaveBeenCalledWith('http://mock-contrat-api.com/api/contrat/download/1', {
      headers: { Authorization: 'Bearer mock-token' },
      responseType: 'blob'
    });
    expect(result).toBe(blob);
    expect(console.log).toHaveBeenCalledWith('Fichier du contrat avec l\'ID 1 récupéré avec succès.');
  });

  it('should fetch contract services successfully', async () => {
    mockAxios.get.and.returnValue(Promise.resolve({ data: 'Service1\nService2' }));
    const result = await service.getContractServices(1);
    expect(mockAxios.get).toHaveBeenCalledWith('http://mock-contrat-api.com/api/contrat/offreDescription/1', {
      headers: { Authorization: 'Bearer mock-token' }
    });
    expect(result).toEqual(['Service1', 'Service2']);
  });

  it('should fetch all clients successfully', async () => {
    mockAxios.get.and.returnValue(Promise.resolve({ data: [{ id: 1, name: 'Client1' }] }));
    const result = await service.getAllClients();
    expect(mockAxios.get).toHaveBeenCalledWith('http://mock-user-api.com/clients/', {
      headers: { Authorization: 'Bearer mock-token' }
    });
    expect(result).toEqual([{ id: 1, name: 'Client1' }]);
  });
});