import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubPartnersListPartComponent } from './sub-partners-list-part.component';

describe('SubPartnersListPartComponent', () => {
  let component: SubPartnersListPartComponent;
  let fixture: ComponentFixture<SubPartnersListPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubPartnersListPartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubPartnersListPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
