
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { HeaderComponent } from "./header/header.component"; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, RouterOutlet, HttpClientModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'frontend_glop';

  constructor() { }

  ngOnInit(): void {
  }
}