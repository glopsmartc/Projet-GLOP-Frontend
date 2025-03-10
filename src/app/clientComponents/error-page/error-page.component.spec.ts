import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorPageComponent } from './error-page.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('ErrorPageComponent', () => {
  let component: ErrorPageComponent;
  let fixture: ComponentFixture<ErrorPageComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ErrorPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /subscription-form when goHome is called', () => {
    component.goHome();
    expect(router.navigate).toHaveBeenCalledWith(['/subscription-form']);
  });
});
