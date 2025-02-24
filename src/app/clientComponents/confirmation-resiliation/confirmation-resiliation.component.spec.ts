import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationResiliationComponent } from './confirmation-resiliation.component';
import { MatDialogRef } from '@angular/material/dialog';

describe('ConfirmationResiliationComponent', () => {
  let component: ConfirmationResiliationComponent;
  let fixture: ComponentFixture<ConfirmationResiliationComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ConfirmationResiliationComponent>>;

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ConfirmationResiliationComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ConfirmationResiliationComponent>>;

    fixture = TestBed.createComponent(ConfirmationResiliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog with "true" when onConfirm is called', () => {
    component.onConfirm();

    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog with "false" when onCancel is called', () => {
    component.onCancel();

    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});
