import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import axios from 'axios';

declare const window: any;

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    window.config = { apiBaseUrl: 'https://api.example.com' };
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'token') {
        return 'mocked.token.payload';
      }
      return null;
    });
    spyOn(localStorage, 'setItem').and.stub();
    spyOn(localStorage, 'removeItem').and.stub();

    TestBed.configureTestingModule({
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with correct apiUrl from window.config', () => {
    expect(service['apiUrl']).toBe('https://api.example.com/auth');
  });

  it('should log a warning if window.config is not available', () => {
    spyOn(console, 'warn');
    window.config = undefined;

    const result = service['getApiUrl']();
    expect(result).toBe('');
    expect(console.warn).toHaveBeenCalledWith('window.config is not available');
  });


  it('should check if the user has a specific role', () => {
    service['roles'] = ['USER', 'ADMIN'];
    expect(service.hasRole(['USER'])).toBeTrue();
    expect(service.hasRole(['GUEST'])).toBeFalse();
  });

  it('should log the role if user is CONSEILLER', () => {
    spyOn(console, 'log');
    service['roles'] = ['CONSEILLER'];
    service.logRole();
    expect(console.log).toHaveBeenCalledWith('Logged in as CONSEILLER');
  });

  it('should log the role if user is not CONSEILLER', () => {
    spyOn(console, 'log');
    service['roles'] = ['USER'];
    service.logRole();
    expect(console.log).toHaveBeenCalledWith('User role:', ['USER']);
  });

  it('should throw an error on sign-in failure', async () => {
    spyOn(axios, 'post').and.returnValue(Promise.reject('Sign-in failed'));

    await expectAsync(service.signIn({ username: 'test', password: 'wrong' })).toBeRejectedWith('Sign-in failed');
  });


});
