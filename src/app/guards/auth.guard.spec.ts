import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

const mockAuthService = {
  isAuthenticated: jasmine.createSpy('isAuthenticated'),
  hasRole: jasmine.createSpy('hasRole')
};

const mockRouter = {
  navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)),
  parseUrl: jasmine.createSpy('parseUrl') 
};

const mockRoute = { data: { roles: ['Conseiller'] } } as unknown as ActivatedRouteSnapshot;
const mockState = { url: '/protected' } as RouterStateSnapshot;

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    mockAuthService.isAuthenticated.calls.reset();
    mockAuthService.hasRole.calls.reset();
    mockRouter.navigate.calls.reset();
  });

  it('should allow access if user is authenticated and has required roles', () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.hasRole.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(result).toBe(true); 
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login if user is not authenticated', () => {
    mockAuthService.isAuthenticated.and.returnValue(false);
    mockAuthService.hasRole.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(result instanceof UrlTree).toBeFalse(); 
  });

  it('should redirect to login if user does not have required roles', () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.hasRole.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(result instanceof UrlTree).toBeFalse();
  });

  it('should allow access if no roles are specified and user is authenticated', () => {
    const mockRouteNoRoles = { data: {} } as unknown as ActivatedRouteSnapshot;
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.hasRole.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => authGuard(mockRouteNoRoles, mockState));

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should allow access if roles array is empty and user is authenticated', () => {
    const mockRouteEmptyRoles = { data: { roles: [] } } as unknown as ActivatedRouteSnapshot;
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.hasRole.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => authGuard(mockRouteEmptyRoles, mockState));

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should call isAuthenticated and hasRole with correct arguments', () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.hasRole.and.returnValue(true);

    TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(authService.isAuthenticated).toHaveBeenCalled();
    expect(authService.hasRole).toHaveBeenCalledWith(['Conseiller']);
  });
});