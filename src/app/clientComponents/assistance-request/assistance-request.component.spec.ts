import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssistanceRequestComponent } from './assistance-request.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { LocationService } from '../../services/location.service';

describe('AssistanceRequestComponent', () => {
  let component: AssistanceRequestComponent;
  let fixture: ComponentFixture<AssistanceRequestComponent>;
  let locationService: jasmine.SpyObj<LocationService>;
  let sanitizer: jasmine.SpyObj<DomSanitizer>;

  beforeEach(async () => {
    const locationServiceSpy = jasmine.createSpyObj('LocationService', ['getCurrentLocation']);
    const sanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);

    await TestBed.configureTestingModule({
      imports: [AssistanceRequestComponent, HttpClientTestingModule, FormsModule, CommonModule],
      providers: [
        { provide: LocationService, useValue: locationServiceSpy },
        { provide: DomSanitizer, useValue: sanitizerSpy }
      ]
    }).compileComponents();

    locationService = TestBed.inject(LocationService) as jasmine.SpyObj<LocationService>;
    sanitizer = TestBed.inject(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistanceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should move to previous step if not on first step', () => {
    component.step = 2;
    component.previousStep();
    expect(component.step).toBe(1);
  });

  it('should validate email correctly', () => {
    expect(component.validateEmail('test@example.com')).toBeTrue();
    expect(component.validateEmail('invalid-email')).toBeFalse();
  });

  it('should handle file upload for PDF', () => {
    const file = new File([''], 'test.pdf', { type: 'application/pdf' });
    const event = { target: { files: [file] } };
    sanitizer.bypassSecurityTrustResourceUrl.and.returnValue('safe-url');
    component.onFileUpload(event);
    expect(component.pdfFiles.length).toBe(1);
    expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalled();
  });

  it('should handle file upload for image', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file] } };
    const readerSpy = jasmine.createSpyObj('FileReader', ['readAsDataURL', 'onload']);
    spyOn(window, 'FileReader').and.returnValue(readerSpy);

    component.onFileUpload(event);
    const mockResult = 'data:image/png;base64,test';
    readerSpy.onload({ target: { result: mockResult } });

    expect(component.imageFiles.length).toBe(1);
    expect(component.imageFiles[0].name).toBe('test.png');
    expect(component.imageFiles[0].preview).toBe(mockResult);
  });

  it('should handle file upload with no files', () => {
    const event = { target: { files: [] } };
    component.onFileUpload(event);
    expect(component.pdfFiles.length).toBe(0);
    expect(component.imageFiles.length).toBe(0);
  });

  it('should remove PDF file', () => {
    component.pdfFiles = [{ file: new File([''], 'test.pdf'), name: 'test.pdf', preview: 'url' }];
    component.removePdf(0);
    expect(component.pdfFiles.length).toBe(0);
  });

  it('should remove image file', () => {
    component.imageFiles = [{ file: new File([''], 'test.png'), name: 'test.png', preview: 'url' }];
    component.removeImage(0);
    expect(component.imageFiles.length).toBe(0);
  });

  it('should get location successfully', async () => {
    locationService.getCurrentLocation.and.returnValue(Promise.resolve({ latitude: 0, longitude: 0, address: 'Test Address' }));
    await component.getLocation();
    expect(component.location).toBe('Test Address');
    expect(component.isLocating).toBeFalse();
  });

  it('should not submit request if step is invalid', () => {
    component.validateAndSubmit();
    expect(component.submitted).toBeFalse();
    expect(component.emptyFieldError).toBeTrue();
  });
});
