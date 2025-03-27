import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReforestationDialogComponent } from './reforestation-dialog.component';
import { By } from '@angular/platform-browser';

const mockDialogRef = {
  close: jasmine.createSpy('close')
};

describe('ReforestationDialogComponent', () => {
  let component: ReforestationDialogComponent;
  let fixture: ComponentFixture<ReforestationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReforestationDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef }, 
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReforestationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog when close() is called', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should display the dialog header', () => {
    const headerElement = fixture.debugElement.query(By.css('.dialog-header'));
    expect(headerElement).toBeTruthy();
    expect(headerElement.nativeElement.textContent).toContain("Soutenez Reforest'Action");
  });

  it('should display the dialog content with text and logo', () => {
    const contentElement = fixture.debugElement.query(By.css('.dialog-content'));
    expect(contentElement).toBeTruthy();

    const paragraphs = contentElement.queryAll(By.css('p'));
    expect(paragraphs.length).toBe(3); 
    expect(paragraphs[0].nativeElement.textContent).toContain("Reforest'Action");
    expect(paragraphs[1].nativeElement.textContent).toContain('Pourquoi ce projet ?');
    expect(paragraphs[2].nativeElement.textContent).toContain('absorption du CO2');

    const logoElement = contentElement.query(By.css('.logo'));
    expect(logoElement).toBeTruthy();
    expect(logoElement.nativeElement.getAttribute('src')).toBe('assets/img/download.png');
    expect(logoElement.nativeElement.getAttribute('alt')).toBe("Logo de Reforest'Action");
  });

  it('should display a close button and trigger close() on click', () => {
    const closeButton = fixture.debugElement.query(By.css('.close-btn'));
    expect(closeButton).toBeTruthy();
    expect(closeButton.nativeElement.textContent).toContain('Fermer');

    closeButton.triggerEventHandler('click', null);
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should apply correct styles to dialog container', () => {
    const container = fixture.debugElement.query(By.css('.dialog-container'));
    const styles = window.getComputedStyle(container.nativeElement);
    expect(styles.textAlign).toBe('center');
    expect(styles.padding).toBe('30px');
    expect(styles.backgroundColor).toBe('rgb(232, 245, 233)'); 
  });
});
