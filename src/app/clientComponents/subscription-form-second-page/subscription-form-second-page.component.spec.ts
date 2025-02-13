import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionFormSecondPageComponent } from './subscription-form-second-page.component';

describe('SubscriptionFormSecondPageComponent', () => {
  let component: SubscriptionFormSecondPageComponent;
  let fixture: ComponentFixture<SubscriptionFormSecondPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionFormSecondPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionFormSecondPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
