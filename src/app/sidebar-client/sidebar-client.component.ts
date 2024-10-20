import { Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-sidebar-client',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-client.component.html',
  styleUrls: ['./sidebar-client.component.css'] // Correction du champ de style
})
export class SidebarClientComponent {
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
