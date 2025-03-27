import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();
  });

  it(`should have the correct title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('MobiSureMoinsDeCO2'); // Update this if you want to change the component's title
  });

  it('should render the app header', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // Check if header component is present
    expect(compiled.querySelector('app-header')).toBeTruthy();
    // Or check for router outlet
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});