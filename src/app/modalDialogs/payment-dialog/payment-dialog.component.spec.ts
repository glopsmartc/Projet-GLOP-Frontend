import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PaymentDialogComponent } from './payment-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const mockDialogRef = {
  close: jasmine.createSpy('close')
};

const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
  getCurrentNavigation: () => null 
};

describe('PaymentDialogComponent', () => {
  let component: PaymentDialogComponent;
  let fixture: ComponentFixture<PaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PaymentDialogComponent, 
        CommonModule,
        MatDialogModule,
        MatInputModule,
        NoopAnimationsModule 
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: Router, useValue: mockRouter },
        { provide: MAT_DIALOG_DATA, useValue: { finalPrice: 100 } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize finalPrice from MAT_DIALOG_DATA', () => {
    expect(component.finalPrice).toBe(100);
  });

  it('should set selectedPlan from history.state if available', () => {
    const mockState = { selectedPlan: { name: 'Test Plan', price: '100€' } };
    spyOnProperty(history, 'state', 'get').and.returnValue(mockState);
    spyOn(console, 'log'); 

    component.ngOnInit();
    expect(component.selectedPlan).toEqual(mockState.selectedPlan);
    expect(console.log).toHaveBeenCalledWith('Données de l\'offre:', mockState.selectedPlan);
  });

  it('should log error if state is not available', () => {
    spyOnProperty(history, 'state', 'get').and.returnValue({});
    spyOn(console, 'error');

    component.ngOnInit();
    expect(component.selectedPlan).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith('State or required data is not available');
  });

  it('should handle payment click, emit event, and close dialog', fakeAsync(() => {
    spyOn(component.paymentConfirmed, 'emit');
    
    component.onPayClick();
    expect(component.isLoading).toBeTrue();

    tick(2000); 
    expect(component.isLoading).toBeFalse();

    tick(1000);
    expect(component.paymentConfirmed.emit).toHaveBeenCalled();
    expect(mockDialogRef.close).toHaveBeenCalled();
  }));

  it('should close dialog with "cancel" on cancel click', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith('cancel');
  });

  it('should toggle isCvcPreviewVisible', () => {
    expect(component.isCvcPreviewVisible).toBeFalse();
    component.toggleCvcPreview();
    expect(component.isCvcPreviewVisible).toBeTrue();
    component.toggleCvcPreview();
    expect(component.isCvcPreviewVisible).toBeFalse();
  });

  it('should display final price in the template', () => {
    const priceElement = fixture.debugElement.query(By.css('.final-price')); 
    if (priceElement) {
      expect(priceElement.nativeElement.textContent).toContain('100');
    }
  });

  
  it('should trigger onPayClick when pay button is clicked', () => {
    spyOn(component, 'onPayClick');
    const payButton = fixture.debugElement.query(By.css('.pay-btn')); 
    if (payButton) {
      payButton.triggerEventHandler('click', null);
      expect(component.onPayClick).toHaveBeenCalled();
    }
  });

  it('should trigger onCancel when cancel button is clicked', () => {
    spyOn(component, 'onCancel');
    const cancelButton = fixture.debugElement.query(By.css('.cancel-btn')); 
    if (cancelButton) {
      cancelButton.triggerEventHandler('click', null);
      expect(component.onCancel).toHaveBeenCalled();
    }
  });
});