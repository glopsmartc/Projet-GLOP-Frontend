import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reforestation-dialog',
  template: `
  <div class="dialog-container">
    <h1 class="dialog-header">Compensez vos émissions de CO2 avec Reforest'Action</h1>
    <div class="dialog-content">
      <p>
          Nous sommes fiers de soutenir <strong>Reforest'Action</strong>, une association dédiée à la
          reforestation mondiale. En ajoutant un supplément pour la compensation de vos émissions de
          carbone, vous contribuez directement à leurs projets de plantation d'arbres et à la préservation des écosystèmes.
          Chaque don que vous réalisez a un impact direct sur la lutte contre le changement climatique en permettant la plantation
          d'arbres dans des zones stratégiques.
      </p>
      <img src="assets/img/download.png" alt="Logo de Reforest'Action" class="logo">
      <p><strong>Pourquoi ce projet ?</strong></p>
      <p>
          La reforestation est l'une des solutions les plus efficaces pour compenser les émissions de CO2 et limiter le réchauffement climatique.
          Chaque arbre planté joue un rôle essentiel dans l'absorption du CO2, tout en relâchant de l'oxygène et en contribuant à la préservation
          de la biodiversité. En soutenant <strong>Reforest'Action</strong>, vous aidez à restaurer des écosystèmes vitaux pour notre planète, tout en
          soutenant des initiatives locales qui bénéficient directement aux communautés.
      </p>
      <p>
          Nous nous engageons, à travers ce projet, à réduire notre empreinte carbone et à contribuer à un avenir plus vert et plus durable pour
          les générations futures. Votre soutien fait la différence !
      </p>
    </div>
    <div class="dialog-actions">
      <p style="text-align: center; font-size: 14px; color: #4A803F; font-family: 'Roboto', sans-serif;">Pour plus d'informations, visitez le site de Reforest'Action : <a href="https://www.reforestaction.com/" target="_blank">reforestaction.com</a></p>
      <button mat-button (click)="close()" class="close-btn">Fermer</button>
    </div>
  </div>
  `,
  styles: [
    `
      .dialog-container {
        padding: 30px;
        background-color: #fff; /* Light green background */
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }

      .dialog-header {
        font-size: 25px;
        color: #4a803f; /* Dark green */
        margin-bottom: 30px;
        font-family: 'Roboto', sans-serif;
        font-weight: bold;
      }

      .dialog-content {
        font-size: 17px;
        color: #333; /* Green color for the text */
        line-height: 1.6;
        margin-bottom: 30px;
        font-family: 'Roboto', sans-serif;
      }

      .logo {
        max-width: 170px;
        margin: 0px auto;
        display: block;
      }

      .dialog-actions {
        display: flex;
        flex-direction: column;
        align-items: center; /* Centers the button horizontally */
        justify-content: center; /* Centers the content vertically (if needed) */
        text-align: center;
      }

      .close-btn {
        border-radius: 20px;
        border: 1px solid #4A803F;
        background-color: #39652f;
        color: #FFFFFF;
        font-size: 14px;
        font-weight: bold;
        padding: 12px 45px;
        letter-spacing: 1px;
        text-transform: uppercase;
        transition: transform 80ms ease-in;
        margin-top: 20px;
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
