import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ForgotPassService } from './forgot-pass.service';

describe('ForgotPassService', () => {
  let service: ForgotPassService;
  let httpMock: HttpTestingController;

  const apiUrl = 'https://mockapi.com/auth';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ForgotPassService]
    });

    service = TestBed.inject(ForgotPassService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('forgotPassword', () => {
    it('should make a POST request to send the email for forgot password', () => {
      const email = 'test@example.com';
      const mockResponse = 'Password reset link sent';

      service.forgotPassword(email).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(req => req.method === 'POST' && req.url.includes('/forgot-password'));
      expect(req.request.body).toEqual({ email });
      req.flush(mockResponse);
    });
  });

  describe('resetPassword', () => {
    it('should make a POST request to reset the password', () => {
      const token = 'mock-token';
      const newPassword = 'newpassword123';
      const mockResponse = 'Password reset successful';

      service.resetPassword(token, newPassword).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(req => req.method === 'POST' && req.url.includes('/reset-password'));
      expect(req.request.body).toEqual({ token, newPassword });
      req.flush(mockResponse);
    });
  });
});
