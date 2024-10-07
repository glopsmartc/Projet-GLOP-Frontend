
import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgFor } from '@angular/common'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'frontend_glop';

  users: any[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      response => {
        this.users = response;
      },
      error => {
        console.error('Erreur lors du chargement des utilisateurs', error);
      }
    );
  }
}