import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AssistanceRequestsLogisComponent } from './assistance-requests-logis.component';
import { AssistanceService } from '../../services/assistance.service';
import { PartenaireService } from '../../services/partenaire.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

const mockAssistanceService = {
  getAllRequests_Conseiller_Logisticien: jasmine.createSpy('getAllRequests_Conseiller_Logisticien').and.returnValue(
    Promise.resolve([
      { idDossier: 1, typeAssistance: 'Logistique', statutDossier: 'En cours', partenaire: 1 },
      { idDossier: 2, typeAssistance: 'Transport', statutDossier: 'Terminé', partenaire: null }
    ])
  ),
  getDocumentsForRequest: jasmine.createSpy('getDocumentsForRequest').and.returnValue(Promise.resolve([{ id: 1, name: 'doc1.pdf' }])),
  assignPartenaireToRequest: jasmine.createSpy('assignPartenaireToRequest').and.returnValue(Promise.resolve()),
  removePartenaireFromDossier: jasmine.createSpy('removePartenaireFromDossier').and.returnValue(Promise.resolve()),
  updateStatut: jasmine.createSpy('updateStatut').and.returnValue(Promise.resolve())
};

const mockPartenaireService = {
  getAllPartenaires: jasmine.createSpy('getAllPartenaires').and.returnValue(
    Promise.resolve([
      { idUser: 1, nomEntreprise: 'Entreprise A', zoneGeographique: 'Nord' },
      { idUser: 2, nomEntreprise: 'Entreprise B', zoneGeographique: 'Sud' }
    ])
  ),
  getPartenaireById: jasmine.createSpy('getPartenaireById').and.callFake((id) => 
    Promise.resolve({ idUser: id, nomEntreprise: `Entreprise ${id}`, zoneGeographique: 'Zone' })
  )
};

describe('AssistanceRequestsLogisComponent', () => {
  let component: AssistanceRequestsLogisComponent;
  let fixture: ComponentFixture<AssistanceRequestsLogisComponent>;
  let assistanceService: AssistanceService;
  let partenaireService: PartenaireService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AssistanceRequestsLogisComponent, 
        CommonModule,
        FormsModule
      ],
      providers: [
        { provide: AssistanceService, useValue: mockAssistanceService },
        { provide: PartenaireService, useValue: mockPartenaireService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistanceRequestsLogisComponent);
    component = fixture.componentInstance;
    assistanceService = TestBed.inject(AssistanceService);
    partenaireService = TestBed.inject(PartenaireService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

 

  it('should set error message if requests fail to load', fakeAsync(() => {
    mockAssistanceService.getAllRequests_Conseiller_Logisticien.and.returnValue(Promise.reject('Erreur'));
    component.loadRequests();
    tick();
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('Impossible de charger les demandes d\'assistance.');
  }));

  it('should sort requests by column', fakeAsync(() => {
    component.requests = [
      { idDossier: 1, typeAssistance: 'Logistique', partenaire: 1 },
      { idDossier: 2, typeAssistance: 'Transport', partenaire: 2 }
    ];
    component.partenaires = {
      1: { nomEntreprise: 'Entreprise A' },
      2: { nomEntreprise: 'Entreprise B' }
    };
    component.sortRequests('typeAssistance');
    expect(component.sortColumn).toBe('typeAssistance');
    expect(component.sortAscending).toBeTrue();
    expect(component.requests[0].typeAssistance).toBe('Logistique');

    component.sortRequests('typeAssistance');
    expect(component.sortAscending).toBeFalse();
    expect(component.requests[0].typeAssistance).toBe('Transport');

    component.sortRequests('partenaire');
    expect(component.requests[0].partenaire).toBe(1); 
  }));

  it('should filter requests by search text', () => {
    component.requests = [
      { idDossier: 1, typeAssistance: 'Logistique', partenaire: 1 },
      { idDossier: 2, typeAssistance: 'Transport', partenaire: null }
    ];
    component.partenaires = { 1: { nomEntreprise: 'Entreprise A' } };
    component.searchText = 'logistique';
    const filtered = component.filterRequests();
    expect(filtered.length).toBe(1);
    expect(filtered[0].typeAssistance).toBe('Logistique');
  });

  it('should assign partenaire to request', fakeAsync(() => {
    component.requests = [{ idDossier: 1, typeAssistance: 'Logistique', partenaire: null }];
    component.assignPartenaire(1, 2);
    tick();
    fixture.detectChanges();
    expect(assistanceService.assignPartenaireToRequest).toHaveBeenCalledWith(2, 1);
    expect(component.requests[0].partenaire).toBe(2);
    expect(component.partenaires[2]).toBeDefined();
    expect(component.processingAssignment[1]).toBeFalse();
  }));

  it('should remove partenaire from request', fakeAsync(() => {
    component.requests = [{ idDossier: 1, typeAssistance: 'Logistique', partenaire: 1 }];
    component.assignPartenaire(1, null);
    tick();
    fixture.detectChanges();
    expect(assistanceService.removePartenaireFromDossier).toHaveBeenCalledWith(1);
    expect(component.requests[0].partenaire).toBeNull();
    expect(component.processingAssignment[1]).toBeFalse();
  }));

  it('should update request status', fakeAsync(() => {
    component.requests = [{ idDossier: 1, typeAssistance: 'Logistique', statutDossier: 'En cours' }];
    component.updateStatut(1, 'Terminé');
    tick();
    fixture.detectChanges();
    expect(assistanceService.updateStatut).toHaveBeenCalledWith(1, 'Terminé');
    expect(component.requests[0].statutDossier).toBe('Terminé');
    expect(component.processingStatutUpdate[1]).toBeFalse();
  }));
});