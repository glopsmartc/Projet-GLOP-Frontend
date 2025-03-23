import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistanceRequestsConsComponent } from './assistance-requests-cons.component';

describe('AssistanceRequestsConsComponent', () => {
  let component: AssistanceRequestsConsComponent;
  let fixture: ComponentFixture<AssistanceRequestsConsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistanceRequestsConsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssistanceRequestsConsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
