import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistanceRequestsPartComponent } from './assistance-requests-part.component';

describe('AssistanceRequestsPartComponent', () => {
  let component: AssistanceRequestsPartComponent;
  let fixture: ComponentFixture<AssistanceRequestsPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistanceRequestsPartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssistanceRequestsPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
