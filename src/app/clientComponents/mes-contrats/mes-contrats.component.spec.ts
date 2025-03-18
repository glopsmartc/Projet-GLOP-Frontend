import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MesContratsComponent } from './mes-contrats.component';
import { ContratService } from '../../services/contrat.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

describe('MesContratsComponent', () => {
  let component: MesContratsComponent;
  let fixture: ComponentFixture<MesContratsComponent>;
  let contratServiceSpy: jasmine.SpyObj<ContratService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    contratServiceSpy = jasmine.createSpyObj('ContratService', ['getUserContracts', 'resilierContrat', 'downloadContractFile']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, MatDialogModule, MesContratsComponent],
      providers: [
        { provide: ContratService, useValue: contratServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MesContratsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load contracts on init', async () => {
    const mockContracts = [
      { id: 1, statut: 'actif' },
      { id: 2, statut: 'résilié' }
    ];
    contratServiceSpy.getUserContracts.and.returnValue(Promise.resolve(mockContracts));
    await component.ngOnInit();
    expect(component.contracts).toEqual(mockContracts);
  });

  it('should filter contracts correctly', () => {
    component.contracts = [
      { id: 1, statut: 'actif' },
      { id: 2, statut: 'résilié' }
    ];
    component.filterContracts('actif');
    expect(component.filteredContracts).toEqual([{ id: 1, statut: 'actif' }]);
  });

  it('should handle contract download', async () => {
    const blobMock = new Blob(['test'], { type: 'application/pdf' });
    contratServiceSpy.downloadContractFile.and.returnValue(Promise.resolve(blobMock));

    spyOn(window, 'URL').and.returnValue({ createObjectURL: jasmine.createSpy(), revokeObjectURL: jasmine.createSpy() } as any);
    spyOn(document, 'createElement').and.callFake(() => {
      return { click: jasmine.createSpy() } as any;
    });

    await component.onDownloadContract('1');
    expect(contratServiceSpy.downloadContractFile).toHaveBeenCalledWith('1');
  });
});
