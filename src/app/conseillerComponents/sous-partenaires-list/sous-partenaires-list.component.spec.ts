import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SousPartenairesListComponent } from './sous-partenaires-list.component';
import { PartenaireService } from '../../services/partenaire.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

const mockPartenaireService = {
  getAllSousPartenaires: jasmine.createSpy('getAllSousPartenaires').and.returnValue(
    Promise.resolve([
      { idSousPartenaire: 1, nom: 'Partenaire A', email: 'a@example.com' },
      { idSousPartenaire: 2, nom: 'Partenaire B', email: 'b@example.com' }
    ])
  ),
  deletePartenaire: jasmine.createSpy('deletePartenaire').and.returnValue(Promise.resolve()),
  updatePartenaire: jasmine.createSpy('updatePartenaire').and.returnValue(Promise.resolve()),
  addPartenaire: jasmine.createSpy('addPartenaire').and.returnValue(Promise.resolve())
};

describe('SousPartenairesListComponent', () => {
  let component: SousPartenairesListComponent;
  let fixture: ComponentFixture<SousPartenairesListComponent>;
  let partenaireService: PartenaireService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SousPartenairesListComponent, 
        CommonModule,
        FormsModule
      ],
      providers: [
        { provide: PartenaireService, useValue: mockPartenaireService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SousPartenairesListComponent);
    component = fixture.componentInstance;
    partenaireService = TestBed.inject(PartenaireService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set error message on load failure', fakeAsync(() => {
    mockPartenaireService.getAllSousPartenaires.and.returnValue(Promise.reject('Erreur'));
    component.loadPartenaires();
    tick();
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('Erreur lors du chargement des partenaires.');
    expect(component.partenaires.length).toBe(0);
  }));

  it('should delete partenaire after confirmation', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.partenaires = [{ idSousPartenaire: 1, nom: 'Partenaire A' }];
    component.deletePartenaire(1);
    tick();
    fixture.detectChanges();
    expect(partenaireService.deletePartenaire).toHaveBeenCalledWith(1);
    expect(component.partenaires.length).toBe(0);
  }));

  it('should start editing partenaire and save changes', fakeAsync(() => {
    const partenaire = { idSousPartenaire: 1, nom: 'Partenaire A' };
    component.editPartenaire(partenaire);
    expect(component.isEditing).toBeTrue();
    expect(component.partenaireEnCours).toEqual(partenaire);

    component.partenaireEnCours.nom = 'Partenaire Modifié';
    component.savePartenaire();
    tick();
    fixture.detectChanges();
    expect(partenaireService.updatePartenaire).toHaveBeenCalledWith(1, { idSousPartenaire: 1, nom: 'Partenaire Modifié' });
    expect(component.isEditing).toBeFalse();
    expect(component.partenaireEnCours).toBeNull();
  }));

  it('should cancel editing', () => {
    component.editPartenaire({ idSousPartenaire: 1, nom: 'Partenaire A' });
    component.cancelEdit();
    expect(component.isEditing).toBeFalse();
    expect(component.partenaireEnCours).toBeNull();
  });

  it('should start adding partenaire and save new partenaire', fakeAsync(() => {
    component.startAdding();
    expect(component.isAdding).toBeTrue();
    expect(component.newPartenaire).toEqual({});

    component.newPartenaire = { nom: 'Nouveau Partenaire' };
    component.addPartenaire();
    tick();
    fixture.detectChanges();
    expect(partenaireService.addPartenaire).toHaveBeenCalledWith({ nom: 'Nouveau Partenaire' });
    expect(component.isAdding).toBeFalse();
    expect(component.newPartenaire).toEqual({});
  }));

  it('should cancel adding', () => {
    component.startAdding();
    component.cancelAdd();
    expect(component.isAdding).toBeFalse();
    expect(component.newPartenaire).toEqual({});
  });

  it('should filter partenaires by search text', () => {
    component.partenaires = [
      { idSousPartenaire: 1, nom: 'Partenaire A', email: 'a@example.com' },
      { idSousPartenaire: 2, nom: 'Partenaire B', email: 'b@example.com' }
    ];
    component.searchText = 'partenaire a';
    const filtered = component.filteredPartenaires;
    expect(filtered.length).toBe(1);
    expect(filtered[0].nom).toBe('Partenaire A');
  });

  
});