import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PartnersListComponent } from './partners-list.component';
import { PartenaireService } from '../../services/partenaire.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

const mockPartenaireService = {
  getAllPartenaires: jasmine.createSpy('getAllPartenaires').and.returnValue(
    Promise.resolve([
      { nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@example.com', numTel: '0123456789' },
      { nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@example.com', numTel: '0987654321' }
    ])
  )
};

describe('PartnersListComponent', () => {
  let component: PartnersListComponent;
  let fixture: ComponentFixture<PartnersListComponent>;
  let partenaireService: PartenaireService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PartnersListComponent, 
        CommonModule,
        FormsModule
      ],
      providers: [
        { provide: PartenaireService, useValue: mockPartenaireService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnersListComponent);
    component = fixture.componentInstance;
    partenaireService = TestBed.inject(PartenaireService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load partenaires on init', fakeAsync(() => {
    component.ngOnInit();
    expect(component.isLoading).toBeTrue();
    tick(); 
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
    expect(component.partenaires.length).toBe(2);
    expect(component.errorMessage).toBeNull();
    expect(partenaireService.getAllPartenaires).toHaveBeenCalled();
  }));

  it('should set error message on load failure', fakeAsync(() => {
    mockPartenaireService.getAllPartenaires.and.returnValue(Promise.reject('Erreur'));
    component.loadPartenaires();
    expect(component.isLoading).toBeTrue();
    tick();
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('Erreur lors du chargement des partenaires. Veuillez réessayer plus tard.');
    expect(component.partenaires.length).toBe(0);
  }));

  it('should return all partenaires when searchText is empty', () => {
    component.partenaires = [
      { nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@example.com', numTel: '0123456789' },
      { nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@example.com', numTel: '0987654321' }
    ];
    component.searchText = '';
    const filtered = component.filteredPartenaires();
    expect(filtered.length).toBe(2);
    expect(filtered).toEqual(component.partenaires);
  });

  it('should filter partenaires by searchText', () => {
    component.partenaires = [
      { nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@example.com', numTel: '0123456789' },
      { nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@example.com', numTel: '0987654321' }
    ];
    component.searchText = 'jean';
    const filtered = component.filteredPartenaires();
    expect(filtered.length).toBe(1);
    expect(filtered[0].nom).toBe('Dupont');
  });

  it('should toggle sort direction when same column is clicked', () => {
    component.sortColumn = 'nom';
    component.sortAscending = true;
    component.sortBy('nom');
    expect(component.sortColumn).toBe('nom');
    expect(component.sortAscending).toBeFalse();
    component.sortBy('nom');
    expect(component.sortAscending).toBeTrue();
  });

  it('should set new sort column and ascending direction', () => {
    component.sortColumn = 'nom';
    component.sortAscending = false;
    component.sortBy('email');
    expect(component.sortColumn).toBe('email');
    expect(component.sortAscending).toBeTrue();
  });

  it('should sort partenaires by column', () => {
    component.partenaires = [
      { nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@example.com', numTel: '0123456789' },
      { nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@example.com', numTel: '0987654321' }
    ];
    component.sortColumn = 'nom';
    component.sortAscending = true;
    const sorted = component.sortedPartenaires();
    expect(sorted[0].nom).toBe('Dupont');
    expect(sorted[1].nom).toBe('Martin');

    component.sortAscending = false;
    const sortedDesc = component.sortedPartenaires();
    expect(sortedDesc[0].nom).toBe('Martin');
    expect(sortedDesc[1].nom).toBe('Dupont');
  });
 

 
});