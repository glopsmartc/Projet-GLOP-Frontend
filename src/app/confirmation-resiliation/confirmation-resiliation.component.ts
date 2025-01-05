import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-resiliation',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-resiliation.component.html',
  styleUrl: './confirmation-resiliation.component.css'
})
export class ConfirmationResiliationComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmationResiliationComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true); //envoie "true" si l'utilisateur confirme
  }

  onCancel(): void {
    this.dialogRef.close(false); //envoie "false" si l'utilisateur annule
  }
}
