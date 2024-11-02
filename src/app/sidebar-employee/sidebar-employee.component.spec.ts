import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarEmployeeComponent } from './sidebar-employee.component';

describe('SidebarEmployeeComponent', () => {
  let component: SidebarEmployeeComponent;
  let fixture: ComponentFixture<SidebarEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
