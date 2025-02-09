import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReforestationDialogComponent } from './reforestation-dialog.component';

describe('ReforestationDialogComponent', () => {
  let component: ReforestationDialogComponent;
  let fixture: ComponentFixture<ReforestationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReforestationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReforestationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
