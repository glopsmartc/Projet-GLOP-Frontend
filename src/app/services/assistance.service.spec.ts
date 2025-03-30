import { TestBed } from '@angular/core/testing';
import { AssistanceService } from './assistance.service';
import { AuthService } from './auth.service';
import axios from 'axios';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 

const mockAuthService = {
  getToken: jasmine.createSpy('getToken').and.returnValue('mock-token')
};

const mockWindowConfig = {
  apiBaseUrlAssistance: 'http://mock-api.com'
};

const mockAxios = jasmine.createSpyObj('axios', ['get', 'post', 'put', 'patch']);

describe('AssistanceService', () => {
  let service: AssistanceService;
  let originalWindowConfig: any;

  beforeEach(() => {
    originalWindowConfig = (window as any).config;

    Object.defineProperty(window, 'config', {
      get: () => mockWindowConfig,
      configurable: true
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AssistanceService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    spyOn(axios, 'get').and.callFake(mockAxios.get);
    spyOn(axios, 'post').and.callFake(mockAxios.post);
    spyOn(axios, 'put').and.callFake(mockAxios.put);
    spyOn(axios, 'patch').and.callFake(mockAxios.patch);

    service = TestBed.inject(AssistanceService);
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
    mockAxios.patch.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return correct API URL from window.config', () => {
    const apiUrl = (service as any).getApiUrl();
    expect(apiUrl).toBe('http://mock-api.com/api/assistance');
  });

  it('should return empty string and warn if window.config is not available', () => {
    Object.defineProperty(window, 'config', { get: () => undefined, configurable: true });
    const apiUrl = (service as any).getApiUrl();
    expect(apiUrl).toBe('');
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

  it('should fetch all requests successfully', async () => {
    mockAxios.get.and.returnValue(Promise.resolve({ data: [{ id: 1, type: 'test' }] }));
    const result = await service.getAllRequests();
    expect(mockAxios.get).toHaveBeenCalledWith('http://mock-api.com/api/assistance/allDossiersClient', {
      headers: { Authorization: 'Bearer mock-token' }
    });
    expect(result).toEqual([{ id: 1, type: 'test' }]);
    expect(console.log).toHaveBeenCalledWith('Données récupérées depuis le backend allDossiersClient:', [{ id: 1, type: 'test' }]);
  });

  it('should throw error on getAllRequests failure', async () => {
    const error = new Error('Network error');
    mockAxios.get.and.returnValue(Promise.reject(error));
    await expectAsync(service.getAllRequests()).toBeRejectedWith(error);
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la récupération des demandes:', error);
  });

  it('should fetch all requests for Conseiller_Logisticien successfully', async () => {
    mockAxios.get.and.returnValue(Promise.resolve({ data: [{ id: 2, type: 'logistics' }] }));
    const result = await service.getAllRequests_Conseiller_Logisticien();
    expect(mockAxios.get).toHaveBeenCalledWith('http://mock-api.com/api/assistance/allDossiers', {
      headers: { Authorization: 'Bearer mock-token' }
    });
    expect(result).toEqual([{ id: 2, type: 'logistics' }]);
    expect(console.log).toHaveBeenCalledWith('Données récupérées depuis le backend allDossiers:', [{ id: 2, type: 'logistics' }]);
  });

  it('should throw error on getAllRequests_Conseiller_Logisticien failure', async () => {
    const error = new Error('Network error');
    mockAxios.get.and.returnValue(Promise.reject(error));
    await expectAsync(service.getAllRequests_Conseiller_Logisticien()).toBeRejectedWith(error);
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la récupération des demandes pour Conseiller_Logisticien :', error);
  });

  it('should submit dossier with files successfully', async () => {
    const formData = new FormData();
    mockAxios.post.and.returnValue(Promise.resolve({ data: { id: 3 } }));
    const result = await service.submitDossierWithFiles(formData);
    expect(mockAxios.post).toHaveBeenCalledWith(
      'http://mock-api.com/api/assistance/create',
      formData,
      { headers: { Authorization: 'Bearer mock-token', Accept: 'application/json' } }
    );
    expect(result).toEqual({ id: 3 });
    expect(console.log).toHaveBeenCalledWith('Réponse du backend (demande créé) :', { id: 3 });
  });

  it('should throw error on submitDossierWithFiles failure', async () => {
    const formData = new FormData();
    const error = new Error('Upload error');
    mockAxios.post.and.returnValue(Promise.reject(error));
    await expectAsync(service.submitDossierWithFiles(formData)).toBeRejectedWith(error);
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la création de la demande ou de l\'upload du fichier :', error);
  });

  it('should fetch documents for request successfully', async () => {
    mockAxios.get.and.returnValue(Promise.resolve({ data: [{ id: 1, name: 'doc1.pdf' }] }));
    const result = await service.getDocumentsForRequest(1);
    expect(mockAxios.get).toHaveBeenCalledWith('http://mock-api.com/api/assistance/dossier/1', {
      headers: { Authorization: 'Bearer mock-token' }
    });
    expect(result).toEqual([{ id: 1, name: 'doc1.pdf' }]);
    expect(console.log).toHaveBeenCalledWith('Documents récupérés pour le dossier:', 1, [{ id: 1, name: 'doc1.pdf' }]);
  });

  it('should return empty array on getDocumentsForRequest failure', async () => {
    const error = new Error('Fetch error');
    mockAxios.get.and.returnValue(Promise.reject(error));
    const result = await service.getDocumentsForRequest(1);
    expect(result).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la récupération des documents:', error);
  });

  it('should assign partenaire to request successfully', async () => {
    mockAxios.put.and.returnValue(Promise.resolve({ data: { success: true } }));
    const result = await service.assignPartenaireToRequest(5, 1);
    expect(mockAxios.put).toHaveBeenCalledWith(
      'http://mock-api.com/api/assistance/assigner/5/dossier/1',
      {},
      { headers: { Authorization: 'Bearer mock-token' } }
    );
    expect(result).toEqual({ success: true });
  });

  it('should throw error on assignPartenaireToRequest failure', async () => {
    const error = new Error('Assign error');
    mockAxios.put.and.returnValue(Promise.reject(error));
    await expectAsync(service.assignPartenaireToRequest(5, 1)).toBeRejectedWith(error);
    expect(console.error).toHaveBeenCalledWith('Erreur lors de l\'assignation du partenaire:', error);
  });

  it('should remove partenaire from dossier successfully', async () => {
    mockAxios.put.and.returnValue(Promise.resolve({ data: { success: true } }));
    const result = await service.removePartenaireFromDossier(1);
    expect(mockAxios.put).toHaveBeenCalledWith(
      'http://mock-api.com/api/assistance/removePartenaire/dossier/1',
      {},
      { headers: { Authorization: 'Bearer mock-token' } }
    );
    expect(result).toEqual({ success: true });
  });

  it('should throw error on removePartenaireFromDossier failure', async () => {
    const error = new Error('Remove error');
    mockAxios.put.and.returnValue(Promise.reject(error));
    await expectAsync(service.removePartenaireFromDossier(1)).toBeRejectedWith(error);
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la suppression du partenaire:', error);
  });

  it('should update statut successfully', async () => {
    mockAxios.patch.and.returnValue(Promise.resolve({ data: { id: 1, statut: 'Terminé' } }));
    const result = await service.updateStatut(1, 'Terminé');
    expect(mockAxios.patch).toHaveBeenCalledWith(
      'http://mock-api.com/api/assistance/updateStatut/1',
      null,
      { headers: { Authorization: 'Bearer mock-token' }, params: { statut: 'Terminé' } }
    );
    expect(result).toEqual({ id: 1, statut: 'Terminé' });
  });

  it('should throw error on updateStatut failure', async () => {
    const error = new Error('Update error');
    mockAxios.patch.and.returnValue(Promise.reject(error));
    await expectAsync(service.updateStatut(1, 'Terminé')).toBeRejectedWith(error);
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la mise à jour du statut:', error);
  });
}); 