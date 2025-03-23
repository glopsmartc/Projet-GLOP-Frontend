import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistanceRequestListComponent } from './assistance-request-list.component';

describe('AssistanceRequestListComponent', () => {
  let component: AssistanceRequestListComponent;
  let fixture: ComponentFixture<AssistanceRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistanceRequestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssistanceRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
