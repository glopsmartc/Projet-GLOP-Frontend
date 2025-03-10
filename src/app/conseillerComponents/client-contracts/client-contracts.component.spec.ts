import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ClientContractsComponent } from './client-contracts.component';
import { ContratService } from '../../services/contrat.service';
import { of, throwError } from 'rxjs';

class MockContratService {
  getAllContratsFroConseiller() {
    return of([
      { id: '1', clientNom: 'John', clientPrenom: 'Doe', numeroTelephone: '12345', client: 'john@example.com', statut: 'Active', pdfPath: '/path/to/pdf1' },
      { id: '2', clientNom: 'Jane', clientPrenom: 'Smith', numeroTelephone: '67890', client: 'jane@example.com', statut: 'Inactive', pdfPath: '/path/to/pdf2' },
    ]);
  }

  downloadContractFile(contractId: string) {
    return of(new Blob());
  }
}

describe('ClientContractsComponent', () => {
  let component: ClientContractsComponent;
  let fixture: ComponentFixture<ClientContractsComponent>;
  let contratService: MockContratService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ClientContractsComponent],
      providers: [{ provide: ContratService, useClass: MockContratService }],
    }).compileComponents();

    contratService = TestBed.inject(ContratService) as unknown as MockContratService;
    fixture = TestBed.createComponent(ClientContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });



  it('should handle error when downloading contract', async () => {
    spyOn(contratService, 'downloadContractFile').and.returnValue(throwError('Download error'));

    const contractId = '1';
    await component.onDownloadContract(contractId);

    expect(component.errorMessage).toBe('Erreur lors du téléchargement du contrat. Veuillez réessayer plus tard.');
  });
});
