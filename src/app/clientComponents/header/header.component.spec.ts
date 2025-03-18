import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated$', 'hasRole', 'logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ CommonModule, RouterTestingModule ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to authentication status on init', () => {
    authService.isAuthenticated$ = of(true);
    authService.hasRole.and.returnValue(true);

    component.ngOnInit();

    expect(component.isAuthenticated).toBeTrue();
    expect(component.isClient).toBeTrue();
  });

  it('should call logout and navigate to login on logout', () => {
    component.onLogout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should collapse the navbar when collapseNavbar is called', () => {
    const mockElement = {
      classList: {
        contains: jasmine.createSpy().and.returnValue(true),
        remove: jasmine.createSpy()
      }
    };
    spyOn(document, 'getElementById').and.returnValue(mockElement as any);

    component.collapseNavbar();

    expect(mockElement.classList.remove).toHaveBeenCalledWith('show');
  });
});
