import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistanceRequestsPartComponent } from './assistance-requests-part.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 

describe('AssistanceRequestsPartComponent', () => {
  let component: AssistanceRequestsPartComponent;
  let fixture: ComponentFixture<AssistanceRequestsPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistanceRequestsPartComponent, HttpClientTestingModule]
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
