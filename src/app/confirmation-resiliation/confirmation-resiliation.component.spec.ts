import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationResiliationComponent } from './confirmation-resiliation.component';

describe('ConfirmationResiliationComponent', () => {
  let component: ConfirmationResiliationComponent;
  let fixture: ComponentFixture<ConfirmationResiliationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationResiliationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationResiliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
