import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ClientContractsComponent } from './client-contracts.component';
import { ContratService } from '../../services/contrat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

const mockContratService = {
  getAllContratsFroConseiller: jasmine.createSpy('getAllContratsFroConseiller').and.returnValue(
    Promise.resolve([
      { id: '1', clientNom: 'Dupont', clientPrenom: 'Jean', numeroTelephone: '0123456789', client: 'jean.dupont@example.com', statut: 'Actif', pdfPath: '/path/to/contrat1.pdf' },
      { id: '2', clientNom: 'Martin', clientPrenom: 'Sophie', numeroTelephone: '0987654321', client: 'sophie.martin@example.com', statut: 'Terminé', pdfPath: '/path/to/contrat2.pdf' },
      { id: '3', clientNom: 'Dupont', clientPrenom: 'Jean', numeroTelephone: '0123456789', client: 'jean.dupont@example.com', statut: 'En attente', pdfPath: '/path/to/contrat3.pdf' }
    ])
  ),
  downloadContractFile: jasmine.createSpy('downloadContractFile').and.returnValue(Promise.resolve(new Blob(['test'], { type: 'application/pdf' })))
};

describe('ClientContractsComponent', () => {
  let component: ClientContractsComponent;
  let fixture: ComponentFixture<ClientContractsComponent>;
  let contratService: ContratService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ClientContractsComponent, 
        CommonModule,
        FormsModule
      ],
      providers: [
        { provide: ContratService, useValue: mockContratService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientContractsComponent);
    component = fixture.componentInstance;
    contratService = TestBed.inject(ContratService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set error message on load failure', fakeAsync(() => {
    spyOn(console, 'error');
    mockContratService.getAllContratsFroConseiller.and.returnValue(Promise.reject('Erreur'));
    component.loadClientContracts();
    expect(component.isLoading).toBeTrue();
    tick();
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('Erreur lors du chargement des contrats. Veuillez réessayer plus tard.');
    expect(component.groupedClients.length).toBe(0);
    expect(console.error).toHaveBeenCalledWith('Erreur lors du chargement des contrats:', 'Erreur');
  }));

  it('should return all grouped clients when searchText is empty', () => {
    component.groupedClients = [
      { nom: 'Dupont', prenom: 'Jean', contrats: [] },
      { nom: 'Martin', prenom: 'Sophie', contrats: [] }
    ];
    component.searchText = '';
    const filtered = component.filteredClients();
    expect(filtered.length).toBe(2);
    expect(filtered).toEqual(component.groupedClients);
  });

  it('should filter grouped clients by searchText', () => {
    component.groupedClients = [
      { nom: 'Dupont', prenom: 'Jean', contrats: [] },
      { nom: 'Martin', prenom: 'Sophie', contrats: [] }
    ];
    component.searchText = 'jean';
    const filtered = component.filteredClients();
    expect(filtered.length).toBe(1);
    expect(filtered[0].nom).toBe('Dupont');
  });

  it('should set error message on download failure', fakeAsync(() => {
    spyOn(console, 'error');
    mockContratService.downloadContractFile.and.returnValue(Promise.reject('Erreur'));
    component.onDownloadContract('1');
    tick();
    fixture.detectChanges();
    expect(contratService.downloadContractFile).toHaveBeenCalledWith('1');
    expect(component.errorMessage).toBe('Erreur lors du téléchargement du contrat. Veuillez réessayer plus tard.');
    expect(console.error).toHaveBeenCalledWith('Erreur lors du téléchargement du contrat:', 'Erreur');
  }));


});