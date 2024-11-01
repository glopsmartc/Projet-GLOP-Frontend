import { Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-sidebar-employee',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-employee.component.html',
  styleUrls: ['./sidebar-employee.component.css']
})
export class SidebarEmployeeComponent {
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const hamBurger: HTMLElement | null = this.elementRef.nativeElement.querySelector(".toggle-btn");
    
    if (hamBurger) {
      this.renderer.listen(hamBurger, 'click', () => {
        const sidebar: HTMLElement | null = this.elementRef.nativeElement.querySelector("#sidebar");
        
        if (sidebar) {
          sidebar.classList.toggle("expand");
        }
      });
    }
  }
}
