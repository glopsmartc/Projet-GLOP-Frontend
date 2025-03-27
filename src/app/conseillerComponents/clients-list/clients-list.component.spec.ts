import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ClientListComponent } from './clients-list.component';
import { ContratService } from '../../services/contrat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';


const mockContratService = {
  getAllClients: jasmine.createSpy('getAllClients').and.returnValue(
    Promise.resolve([
      { nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@example.com', numTel: '0123456789' },
      { nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@example.com', numTel: '0987654321' }
    ])
  )
};

describe('ClientListComponent', () => {
  let component: ClientListComponent;
  let fixture: ComponentFixture<ClientListComponent>;
  let contratService: ContratService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ClientListComponent, 
        CommonModule,
        FormsModule
      ],
      providers: [
        { provide: ContratService, useValue: mockContratService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientListComponent);
    component = fixture.componentInstance;
    contratService = TestBed.inject(ContratService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should set error message on load failure', fakeAsync(() => {
    mockContratService.getAllClients.and.returnValue(Promise.reject('Erreur'));
    component.loadClients();
    expect(component.isLoading).toBeTrue();
    tick();
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('Erreur lors du chargement des clients. Veuillez réessayer plus tard.');
    expect(component.clients.length).toBe(0);
  }));

  it('should return all clients when searchText is empty', () => {
    component.clients = [
      { nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@example.com', numTel: '0123456789' },
      { nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@example.com', numTel: '0987654321' }
    ];
    component.searchText = '';
    const filtered = component.filteredClients();
    expect(filtered.length).toBe(2);
    expect(filtered).toEqual(component.clients);
  });

  it('should filter clients by searchText', () => {
    component.clients = [
      { nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@example.com', numTel: '0123456789' },
      { nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@example.com', numTel: '0987654321' }
    ];
    component.searchText = 'jean';
    const filtered = component.filteredClients();
    expect(filtered.length).toBe(1);
    expect(filtered[0].nom).toBe('Dupont');
  });

  it('should filter clients by email', () => {
    component.clients = [
      { nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@example.com', numTel: '0123456789' },
      { nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@example.com', numTel: '0987654321' }
    ];
    component.searchText = 'sophie.martin';
    const filtered = component.filteredClients();
    expect(filtered.length).toBe(1);
    expect(filtered[0].nom).toBe('Martin');
  });

  it('should filter clients by numTel', () => {
    component.clients = [
      { nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@example.com', numTel: '0123456789' },
      { nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@example.com', numTel: '0987654321' }
    ];
    component.searchText = '0987654321';
    const filtered = component.filteredClients();
    expect(filtered.length).toBe(1);
    expect(filtered[0].nom).toBe('Martin');
  });
  
});