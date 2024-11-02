
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { HeaderComponent } from "./components/header/header.component"; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, RouterOutlet, HttpClientModule, HeaderComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'MobiSureMoinsDeCO2';

  constructor() { }

  ngOnInit(): void {
  }
}