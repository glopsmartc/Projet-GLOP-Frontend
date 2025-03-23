import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SousPartenairesListComponent } from './sous-partenaires-list.component';

describe('SousPartenairesListComponent', () => {
  let component: SousPartenairesListComponent;
  let fixture: ComponentFixture<SousPartenairesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SousPartenairesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SousPartenairesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
