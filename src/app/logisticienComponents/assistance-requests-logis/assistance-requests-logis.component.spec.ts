import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistanceRequestsLogisComponent } from './assistance-requests-logis.component';

describe('AssistanceRequestsLogisComponent', () => {
  let component: AssistanceRequestsLogisComponent;
  let fixture: ComponentFixture<AssistanceRequestsLogisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistanceRequestsLogisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssistanceRequestsLogisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
