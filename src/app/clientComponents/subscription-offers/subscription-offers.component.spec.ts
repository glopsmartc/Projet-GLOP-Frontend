import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubscriptionOffersComponent } from './subscription-offers.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

const mockRouter = {
  getCurrentNavigation: jasmine.createSpy('getCurrentNavigation'),
  navigate: jasmine.createSpy('navigate')
};

describe('SubscriptionOffersComponent', () => {
  let component: SubscriptionOffersComponent;
  let fixture: ComponentFixture<SubscriptionOffersComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SubscriptionOffersComponent,
        CommonModule
      ],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionOffersComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    
    mockRouter.getCurrentNavigation.calls.reset();
    mockRouter.navigate.calls.reset();
    jasmine.getEnv().allowRespy(true); 
    spyOnProperty(history, 'state', 'get').and.returnValue({}); 
    spyOn(console, 'log').and.callThrough();
    spyOn(console, 'error').and.callThrough(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with navigation state data', () => {
    const mockState = {
      offre: { nomOffre: 'Offre A', prixMinTotal: 100, prixMaxTotal: 200, descriptionMin: 'Min', descriptionMax: 'Max' },
      formData: { field1: 'value1' }
    };
    mockRouter.getCurrentNavigation.and.returnValue({ extras: { state: mockState } });

    component.ngOnInit();

    expect(component.offre).toEqual(mockState.offre);
    expect(component.formData).toEqual(mockState.formData);
    expect(console.log).toHaveBeenCalledWith('Données de l\'offre reçues:', mockState.offre);
    expect(console.log).toHaveBeenCalledWith('Données du formulaire reçues:', mockState.formData);
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should initialize with history state data when navigation state is unavailable', () => {
    const mockState = {
      offre: { nomOffre: 'Offre B', prixMinTotal: 150, prixMaxTotal: 250, descriptionMin: 'Min B', descriptionMax: 'Max B' },
      formData: { field2: 'value2' }
    };
    mockRouter.getCurrentNavigation.and.returnValue(null);
    spyOnProperty(history, 'state', 'get').and.returnValue(mockState);

    component.ngOnInit();

    expect(component.offre).toEqual(mockState.offre);
    expect(component.formData).toEqual(mockState.formData);
    expect(console.log).toHaveBeenCalledWith('Données de l\'offre reçues:', mockState.offre);
    expect(console.log).toHaveBeenCalledWith('Données du formulaire reçues:', mockState.formData);
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should log error when state data is not available', () => {
    mockRouter.getCurrentNavigation.and.returnValue(null);
    spyOnProperty(history, 'state', 'get').and.returnValue({});

    component.ngOnInit();

    expect(component.offre).toBeUndefined();
    expect(component.formData).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith('State or required data is not available');
    expect(console.log).not.toHaveBeenCalled();
  });

  it('should navigate to sign contract with standard plan', () => {
    component.offre = { nomOffre: 'Offre A', prixMinTotal: 100, prixMaxTotal: 200, descriptionMin: 'Min', descriptionMax: 'Max' };
    component.formData = { field1: 'value1' };

    component.navigateToSignContract('standard');

    const expectedPlan = {
      type: 'standard',
      name: 'Offre A',
      price: 100,
      description: 'Min'
    };
    expect(router.navigate).toHaveBeenCalledWith(['/sign-contract'], {
      state: { selectedPlan: expectedPlan, formData: component.formData }
    });
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should navigate to sign contract with premium plan', () => {
    component.offre = { nomOffre: 'Offre A', prixMinTotal: 100, prixMaxTotal: 200, descriptionMin: 'Min', descriptionMax: 'Max' };
    component.formData = { field1: 'value1' };

    component.navigateToSignContract('premium');

    const expectedPlan = {
      type: 'premium',
      name: 'Offre A',
      price: 200,
      description: 'Max'
    };
    expect(router.navigate).toHaveBeenCalledWith(['/sign-contract'], {
      state: { selectedPlan: expectedPlan, formData: component.formData }
    });
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should log error and not navigate if offre is not available', () => {
    component.offre = null;
    component.navigateToSignContract('standard');

    expect(router.navigate).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Offre is not available!');
  });
 
});