import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateEmissionComponent } from './calculate-emission.component';

describe('CalculateEmissionComponent', () => {
  let component: CalculateEmissionComponent;
  let fixture: ComponentFixture<CalculateEmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculateEmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculateEmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
