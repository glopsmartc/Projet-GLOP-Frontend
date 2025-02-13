import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionOffersComponent } from './subscription-offers.component';

describe('SubscriptionOffersComponent', () => {
  let component: SubscriptionOffersComponent;
  let fixture: ComponentFixture<SubscriptionOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionOffersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
