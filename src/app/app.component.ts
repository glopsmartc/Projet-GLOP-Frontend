import { Component, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { HeaderComponent } from './clientComponents/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, HeaderComponent, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'MobiSureMoinsDeCO2';
  isAuthenticated: boolean = false;
  isClient: boolean = false;
  private authSubscription: Subscription | undefined;

  constructor(private elementRef: ElementRef, private renderer: Renderer2, public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      this.isClient = this.authService.hasRole(['ROLE_CLIENT']);
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  get isUserAuthenticated() {
    return this.authService.isAuthenticated();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


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
