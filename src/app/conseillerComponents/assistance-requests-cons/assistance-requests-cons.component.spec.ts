import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AssistanceRequestsConsComponent } from './assistance-requests-cons.component';
import { AssistanceService } from '../../services/assistance.service';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

const mockAssistanceService = {
  getAllRequests_Conseiller_Logisticien: jasmine.createSpy('getAllRequests_Conseiller_Logisticien').and.returnValue(
    Promise.resolve([
      { id: 1, typeAssistance: 'Logistique', statut: 'En cours', priorite: 'Haute' },
      { id: 2, typeAssistance: 'Transport', statut: 'Terminé', priorite: 'Basse' }
    ])
  ),
  getDocumentsForRequest: jasmine.createSpy('getDocumentsForRequest').and.returnValue(
    Promise.resolve([{ id: 1, name: 'doc1.pdf' }, { id: 2, name: 'doc2.pdf' }])
  )
};

describe('AssistanceRequestsConsComponent', () => {
  let component: AssistanceRequestsConsComponent;
  let fixture: ComponentFixture<AssistanceRequestsConsComponent>;
  let assistanceService: AssistanceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AssistanceRequestsConsComponent, 
        CommonModule
      ],
      providers: [
        { provide: AssistanceService, useValue: mockAssistanceService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistanceRequestsConsComponent);
    component = fixture.componentInstance;
    assistanceService = TestBed.inject(AssistanceService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set error message on load failure', fakeAsync(() => {
    mockAssistanceService.getAllRequests_Conseiller_Logisticien.and.returnValue(Promise.reject('Erreur'));
    component.loadRequests();
    expect(component.loading).toBeTrue();
    tick();
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('Impossible de charger les demandes d\'assistance.');
    expect(component.requests.length).toBe(0);
  }));


  it('should close details and clear documents', () => {
    component.selectedRequest = { id: 1, typeAssistance: 'Logistique' };
    component.documents = [{ id: 1, name: 'doc1.pdf' }];
    component.closeDetails();
    expect(component.selectedRequest).toBeNull();
    expect(component.documents.length).toBe(0);
  });

  it('should return correct status class', () => {
    expect(component.getStatusClass('En cours')).toBe('badge status-en-cours');
    expect(component.getStatusClass('Terminé')).toBe('badge status-terminé');
    expect(component.getStatusClass('')).toBe('');
    expect(component.getStatusClass('En attente')).toBe('badge status-en-attente');
  });

  it('should return correct priority class', () => {
    expect(component.getPriorityClass('Haute')).toBe('badge priority-haute');
    expect(component.getPriorityClass('Basse')).toBe('badge priority-basse');
    expect(component.getPriorityClass('')).toBe('');
    expect(component.getPriorityClass('Moyenne')).toBe('badge priority-moyenne');
  });

});