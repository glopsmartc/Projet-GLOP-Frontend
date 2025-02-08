import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reforestation-dialog',
  template: `
  <div class="dialog-container">
    <h1 class="dialog-header">Soutenez Reforest'Action</h1>
    <div class="dialog-content">
      <p>
        Nous sommes fiers de soutenir <strong>Reforest'Action</strong>, une association dédiée à la
        reforestation mondiale. En ajoutant un supplément pour la compensation de vos émissions de
        carbone, vous contribuez directement à leurs projets de plantation d'arbres.
      </p>
      <img src="assets/img/download.png" alt="Logo de Reforest'Action" class="logo">
      <p><strong>Pourquoi ce projet ?</strong></p>
      <p>
        Chaque arbre planté a un impact significatif sur l'absorption du CO2, et nous nous engageons à
        réduire notre empreinte carbone pour un avenir plus vert.
      </p>
    </div>
    <button mat-button (click)="close()" class="close-btn">Fermer</button>
  </div>
  `,
  styles: [
    `
      .dialog-container {
        text-align: center;
        padding: 30px;
        background-color: #e8f5e9; /* Light green background */
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }

      .dialog-header {
        font-size: 28px;
        color: #388e3c; /* Dark green */
        margin-bottom: 20px;
        font-family: 'Roboto', sans-serif;
        font-weight: bold;
      }

      .dialog-content {
        font-size: 18px;
        color: #4caf50; /* Green color for the text */
        line-height: 1.6;
        margin-bottom: 30px;
        font-family: 'Roboto', sans-serif;
      }

      .logo {
        max-width: 120px;
        margin: 20px auto;
        display: block;
      }

      .close-btn {
        background-color: #4caf50; /* Main green */
        color: white;
        padding: 12px 25px;
        border-radius: 30px;
        font-size: 16px;
        text-transform: uppercase;
        letter-spacing: 1px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .close-btn:hover {
        background-color: #388e3c; /* Darker green on hover */
      }

      .close-btn:focus {
        outline: none;
      }
    `
  ]
})
export class ReforestationDialogComponent {
  constructor(private dialogRef: MatDialogRef<ReforestationDialogComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
