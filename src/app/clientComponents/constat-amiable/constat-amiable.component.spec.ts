import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstatAmiableComponent } from './constat-amiable.component';

describe('ConstatAmiableComponent', () => {
  let component: ConstatAmiableComponent;
  let fixture: ComponentFixture<ConstatAmiableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstatAmiableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstatAmiableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
