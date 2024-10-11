import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  @ViewChild('container', { static: false }) container!: ElementRef;

  signUp() {
    this.container.nativeElement.classList.add("right-panel-active");
  }

  signIn() {
    this.container.nativeElement.classList.remove("right-panel-active");
  }
}
